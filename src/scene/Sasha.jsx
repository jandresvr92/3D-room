import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Center, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { makeClay } from './clay'
import { SASHA } from './layout'
import { heightAt, planRoute, MAX_STEP, MAX_REACH, NOSE_SHRINK } from './nav'

const URL = `${import.meta.env.BASE_URL}models/sasha.glb`

const SPEED = 2.6 // unidades por segundo
const TURN = 9 // qué tan rápido gira hacia donde va
const BODY = 0.65 * SASHA.scale // distancia del centro a la nariz/cola, para medir el terreno bajo el cuerpo
const PIVOT = 0.5 * SASHA.scale // altura del eje sobre el que se inclina al subir/bajar

const KEYMAP = {
  w: 'up', arrowup: 'up',
  s: 'down', arrowdown: 'down',
  a: 'left', arrowleft: 'left',
  d: 'right', arrowright: 'right',
}

const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a))
const ground = (x, z, fallback) => {
  const h = heightAt(x, z)
  return Number.isFinite(h) ? h : fallback
}

/**
 * Sasha, la perrita que camina. El modelo no tiene esqueleto, así que el paso se simula
 * por código: rebote, balanceo lateral, inclinación en la escalera y respiración en reposo.
 * `controller.current.goTo(x, z)` la manda caminar a un punto (usado por los clics).
 */
export default function Sasha({ controller }) {
  const { scene } = useGLTF(URL)
  const camera = useThree((s) => s.camera)
  const root = useRef()
  const tilt = useRef()
  const body = useRef()
  const marker = useRef()
  const keys = useRef(new Set())
  const st = useRef({
    x: SASHA.start[0],
    z: SASHA.start[2],
    y: 0,
    yaw: SASHA.startYaw,
    pitch: 0,
    walk: 0,
    phase: 0,
    stuck: 0,
    route: [],
  })

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return
      child.castShadow = true
      child.receiveShadow = true
      const mats = Array.isArray(child.material) ? child.material : [child.material]
      mats.forEach((m) => m && makeClay(m))
    })
  }, [scene])

  // Teclado: WASD o flechas, relativo a la cámara. Cancela la ruta del clic.
  useEffect(() => {
    const down = (e) => {
      const k = KEYMAP[e.key.toLowerCase()]
      if (!k) return
      e.preventDefault()
      keys.current.add(k)
      st.current.route = []
    }
    const up = (e) => {
      const k = KEYMAP[e.key.toLowerCase()]
      if (k) keys.current.delete(k)
    }
    const clear = () => keys.current.clear()
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
    }
  }, [])

  useEffect(() => {
    if (!controller) return
    controller.current = {
      goTo(x, z) {
        if (!Number.isFinite(heightAt(x, z))) return false
        const s = st.current
        s.route = planRoute([s.x, s.z], [x, z])
        s.stuck = 0
        return true
      },
    }
  }, [controller])

  const camDir = useRef(new THREE.Vector3())

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const s = st.current
    const k = keys.current

    // 1. Hacia dónde quiere ir
    let dx = 0
    let dz = 0
    let remaining = Infinity
    const manual = k.size > 0
    if (manual) {
      s.route = [] // el control directo cancela la ruta del clic/toque
      const f = camera.getWorldDirection(camDir.current)
      f.y = 0
      f.normalize()
      const fwd = (k.has('up') ? 1 : 0) - (k.has('down') ? 1 : 0)
      const side = (k.has('right') ? 1 : 0) - (k.has('left') ? 1 : 0)
      dx = f.x * fwd - f.z * side
      dz = f.z * fwd + f.x * side
    } else if (s.route.length) {
      const [tx, tz] = s.route[0]
      dx = tx - s.x
      dz = tz - s.z
      remaining = Math.hypot(dx, dz)
      if (remaining < 0.12) {
        s.route.shift()
        dx = dz = 0
      }
    }

    // 2. Girar y avanzar, respetando desniveles y obstáculos (con deslizamiento por los bordes)
    let moved = 0
    const len = Math.hypot(dx, dz)
    if (len > 1e-4) {
      dx /= len
      dz /= len
      const diff = wrapAngle(Math.atan2(dx, dz) - s.yaw)
      s.yaw = wrapAngle(s.yaw + diff * Math.min(1, dt * TURN))
      const step = Math.min(SPEED * dt * Math.max(0.25, Math.cos(diff)), remaining)
      const here = heightAt(s.x, s.z)

      const tryMove = (mx, mz) => {
        const ml = Math.hypot(mx, mz)
        if (ml < 1e-4) return false
        const nx = s.x + mx * step
        const nz = s.z + mz * step
        const h = heightAt(nx, nz)
        if (!Number.isFinite(h) || Math.abs(h - here) > MAX_STEP) return false
        // La nariz no puede chocar con algo alto (pared, brazo del sofá, Bella);
        // las caídas no importan porque el centro ya no puede bajar más de MAX_STEP
        const nose = heightAt(nx + (mx / ml) * BODY, nz + (mz / ml) * BODY, NOSE_SHRINK)
        if (!Number.isFinite(nose) || nose - h > MAX_REACH) return false
        s.x = nx
        s.z = nz
        return true
      }

      if (tryMove(dx, dz) || tryMove(dx, 0) || tryMove(0, dz)) {
        moved = step
        s.stuck = 0
      } else if ((s.stuck += dt) > 0.6) {
        // Punto intermedio bloqueado: lo salta y sigue. Si era el destino, se queda ahí.
        if (s.route.length > 1 && !manual) s.route.shift()
        else s.route = []
        s.stuck = 0
      }
    }

    // 3. Altura e inclinación según el terreno bajo patas delanteras y traseras
    const g = heightAt(s.x, s.z)
    s.y += (g - s.y) * Math.min(1, dt * 10)
    const fx = Math.sin(s.yaw)
    const fz = Math.cos(s.yaw)
    const slope = ground(s.x + fx * BODY, s.z + fz * BODY, g) - ground(s.x - fx * BODY, s.z - fz * BODY, g)
    const targetPitch = -Math.atan2(slope, BODY * 2) * 0.8
    s.pitch += (targetPitch - s.pitch) * Math.min(1, dt * 8)

    // 4. Animación procedural del paso
    const walking = Math.min(1, moved / dt / SPEED)
    s.walk += (walking - s.walk) * Math.min(1, dt * 8)
    s.phase += moved * 5
    const t = state.clock.elapsedTime

    root.current.position.set(s.x, s.y, s.z)
    root.current.rotation.y = s.yaw
    tilt.current.rotation.x = s.pitch + Math.sin(s.phase * 2) * 0.025 * s.walk
    tilt.current.rotation.z = Math.sin(s.phase) * 0.05 * s.walk
    body.current.position.y = -PIVOT + Math.abs(Math.sin(s.phase)) * 0.07 * s.walk
    const breath = Math.sin(t * 2.2) * (1 - s.walk)
    body.current.scale.set(1 + breath * 0.008, 1 + breath * 0.016, 1)

    // 5. Marca del destino
    const dest = s.route[s.route.length - 1]
    marker.current.visible = !!dest && !manual
    if (dest) {
      marker.current.position.set(dest[0], ground(dest[0], dest[1], 0) + 0.04, dest[1])
      marker.current.scale.setScalar(1 + Math.sin(t * 6) * 0.08)
    }
  })

  return (
    <>
      <group ref={root}>
        <group scale={SASHA.scale}>
          <group ref={tilt} position={[0, PIVOT, 0]}>
            <group ref={body} position={[0, -PIVOT, 0]}>
              <Center top>
                <primitive object={scene} />
              </Center>
            </group>
          </group>
        </group>
      </group>

      {/* Huellita/anillo donde va a llegar */}
      <mesh ref={marker} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.28, 0.4, 32]} />
        <meshBasicMaterial color="#f0a35e" transparent opacity={0.85} depthWrite={false} />
      </mesh>
    </>
  )
}

useGLTF.preload(URL)
