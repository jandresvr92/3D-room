import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { Blob } from './Sofa'
import { COLORS } from './clay'
import { FLOOR_D, TV } from './layout'

const POWER_TIME = 0.75 // segundos que tarda en encenderse/apagarse

/** Imagen de la pantalla encendida: degradado cálido con el título "Salchipin". */
function useScreenTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 576
    const g = c.getContext('2d')
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    const draw = () => {
      const grad = g.createLinearGradient(0, 0, c.width, c.height)
      grad.addColorStop(0, '#ffd9a8')
      grad.addColorStop(0.55, '#f7a26b')
      grad.addColorStop(1, '#e9779a')
      g.fillStyle = grad
      g.fillRect(0, 0, c.width, c.height)
      // Huellitas de fondo
      g.fillStyle = 'rgba(255,255,255,0.18)'
      for (let i = 0; i < 14; i++) {
        const x = (i * 173) % c.width
        const y = (i * 97 + 40) % c.height
        g.beginPath()
        g.arc(x, y, 22, 0, Math.PI * 2)
        g.fill()
        ;[-28, -10, 10, 28].forEach((dx, k) => {
          g.beginPath()
          g.arc(x + dx, y - 30 - (k === 1 || k === 2 ? 8 : 0), 9, 0, Math.PI * 2)
          g.fill()
        })
      }
      g.fillStyle = '#ffffff'
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.shadowColor = 'rgba(120, 50, 30, 0.35)'
      g.shadowBlur = 18
      g.font = '900 150px Nunito, "Trebuchet MS", sans-serif'
      g.fillText('Salchipin', c.width / 2, c.height / 2 - 20)
      g.shadowBlur = 0
      g.font = '800 44px Nunito, "Trebuchet MS", sans-serif'
      g.fillText('el álbum de Bella & Sasha', c.width / 2, c.height / 2 + 95)
      tex.needsUpdate = true
    }
    draw()
    // Se redibuja cuando la fuente Nunito termina de cargar (si no, sale con la de respaldo)
    document.fonts
      ?.load('900 150px Nunito')
      .then(draw)
      .catch(() => {})
    return tex
  }, [])
}

/**
 * Televisor de pantalla plana colgado en la pared del fondo.
 * Al tocarlo se enciende como una tele vieja (línea de luz que se abre) y avisa con `onClick`.
 */
export default function Tv({ on = false, onClick }) {
  const { width: w, height: h, centerX, centerY } = TV
  const z = -FLOOR_D / 2
  const sw = w - 0.18
  const sh = h - 0.24

  const screen = useRef()
  const light = useRef()
  const power = useRef(0) // 0 apagada … 1 encendida
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const texture = useScreenTexture()

  useFrame((state, dt) => {
    const target = on ? 1 : 0
    const step = Math.min(dt, 0.05) / POWER_TIME
    power.current = target > power.current ? Math.min(1, power.current + step) : Math.max(0, power.current - step)
    const p = power.current

    // Primero una línea horizontal que se abre a lo ancho, después se despliega a lo alto
    const sx = Math.min(1, p / 0.35)
    const sy = p < 0.35 ? 0.012 : 0.012 + ((p - 0.35) / 0.65) * 0.988
    screen.current.visible = p > 0.001
    screen.current.scale.set(Math.max(0.001, sx), sy, 1)
    // Un destello blanco al encenderse que se desvanece en la imagen
    const flash = p < 0.35 ? 1 : 1 - (p - 0.35) / 0.65
    screen.current.material.color.setScalar(1 + flash * 1.5)
    // Parpadeo leve de tele vieja
    screen.current.material.opacity = p >= 1 ? 0.96 + Math.sin(state.clock.elapsedTime * 40) * 0.02 : 1
    // Luz cálida que la pantalla proyecta sobre la habitación
    light.current.intensity = p * 3
  })

  const handleClick = (e) => {
    if (e.delta > 6) return // fue un giro de cámara
    e.stopPropagation() // que Sasha no camine hacia la pared
    onClick?.()
  }

  return (
    <group
      position={[centerX, centerY, z]}
      onClick={handleClick}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
    >
      {/* Soporte de pared */}
      <Blob size={[0.9, 0.6, 0.12]} radius={0.04} color={COLORS.tvFrame} position={[0, 0, 0.06]} />
      {/* Cuerpo y marco (se aclara un poco al pasar el mouse) */}
      <Blob
        size={[w, h, 0.16]}
        radius={0.07}
        color={hovered && !on ? '#3d3f47' : COLORS.tvFrame}
        position={[0, 0, 0.2]}
      />
      {/* Pantalla apagada, un poco satinada */}
      <mesh position={[0, 0.03, 0.285]}>
        <planeGeometry args={[sw, sh]} />
        <meshStandardMaterial color={COLORS.tvScreen} roughness={0.35} metalness={0} />
      </mesh>
      {/* Pantalla encendida (animada) */}
      <mesh ref={screen} position={[0, 0.03, 0.288]} visible={false}>
        <planeGeometry args={[sw, sh]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
      <pointLight ref={light} position={[0, 0, 1.2]} color="#ffb98a" intensity={0} distance={7} decay={2} />
      {/* Reflejo diagonal suave */}
      <mesh position={[-w * 0.18, h * 0.12, 0.29]} rotation={[0, 0, -0.6]}>
        <planeGeometry args={[0.25, h * 0.9]} />
        <meshBasicMaterial color={COLORS.tvGlare} transparent opacity={0.35} />
      </mesh>
      {/* Lucecita de encendido: roja apagada, verde encendida */}
      <mesh position={[w / 2 - 0.25, -h / 2 + 0.06, 0.285]}>
        <circleGeometry args={[0.025, 12]} />
        <meshBasicMaterial color={on ? '#5cf08a' : '#ff5a4f'} />
      </mesh>
    </group>
  )
}
