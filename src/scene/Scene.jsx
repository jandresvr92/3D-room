import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { IS_TOUCH, view, focusPoints } from '../input'
import { OrthographicCamera, OrbitControls, ContactShadows } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import Floor from './Floor'
import Walls from './Walls'
import Tv from './Tv'
import SpecialPhoto from './SpecialPhoto'
import Sofa from './Sofa'
import DogStairs from './DogStairs'
import Bella from './Bella'
import Sasha from './Sasha'
import { CreamThrow, PurplePile } from './Blankets'
import { SOFA, STAIRS, BELLA, CATERPILLAR, SECURITY_CAM, FLOOR_D, seatSpots } from './layout'
import SecurityCamera from './SecurityCamera'
import Caterpillar from './Caterpillar'

const deg = (d) => (d * Math.PI) / 180

function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} color="#ffe2c4" />
      <hemisphereLight args={['#fff4e6', '#b08a6a', 0.55]} />
      <directionalLight
        position={[7, 13, 6]}
        intensity={2.1}
        color="#fff1dc"
        castShadow
        shadow-mapSize={IS_TOUCH ? [1024, 1024] : [2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-radius={6}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={1}
        shadow-camera-far={40}
      />
      {/* Relleno cálido de atardecer desde el otro lado */}
      <directionalLight position={[-7, 5, 8]} intensity={0.45} color="#ffb070" />
    </>
  )
}

const CAM_POSITION = [14, 12, 16]
const CAM_TARGET = [0, 2.2, 0]

/** Cuánto se acerca la cámara al enfocar a cada perrita (veces el zoom inicial). */
const FOCUS_ZOOM = { bella: 4.5, sasha: 4 }
const SETTLE_TIME = 1.4 // segundos que dura el acercamiento animado
const SCENE_Y = -0.6 // la escena está bajada este tanto (ver el <group> de abajo)

/**
 * @param focus 'bella' | 'sasha' | null — perrita enfocada (la cámara la sigue)
 * @param onFocusChange avisa cuando el enfoque cambia desde la escena (doble clic)
 */
export default function Scene({ tvOn = false, onTvClick, focus = null, onFocusChange }) {
  const { size } = useThree()
  // Zoom responsivo para que la habitación quepa en cualquier pantalla.
  // En vertical (celular) se acerca más: las esquinas del piso pueden quedar un poco fuera,
  // pero la habitación se ve grande en vez de ocupar solo una franja.
  const portrait = size.width / size.height < 0.8
  const zoom = portrait ? size.width / 16 : Math.min(size.width, size.height * 1.05) / 21.5

  const [sx, , sz] = SOFA.position
  const bellaPos = [sx + seatSpots.center[0], SOFA.seatTop + 0.06, sz + seatSpots.center[2]]
  focusPoints.bella.set(bellaPos[0], bellaPos[1] + SCENE_Y + 0.35, bellaPos[2])

  // ---------- Cámara: enfocar a una perrita, seguir a Sasha y volver a la vista inicial ----------
  const controls = useRef()
  const zoomRef = useRef(zoom)
  zoomRef.current = zoom
  const settle = useRef(0) // tiempo restante del acercamiento animado (el zoom se anima solo mientras dura)
  const resetting = useRef(false)
  const userTouched = useRef(false) // si la persona hace zoom a mano, se respeta su zoom
  const tmp = useMemo(() => ({ target: new THREE.Vector3(), offset: new THREE.Vector3() }), [])
  const homeOffset = useMemo(
    () => new THREE.Vector3(...CAM_POSITION).sub(new THREE.Vector3(...CAM_TARGET)),
    [],
  )

  useEffect(() => {
    settle.current = focus ? SETTLE_TIME : 0
    userTouched.current = false
    if (focus) resetting.current = false
  }, [focus])

  useEffect(() => {
    view.reset = () => {
      onFocusChange?.(null)
      resetting.current = true
      userTouched.current = false
    }
  }, [onFocusChange])

  // Si la persona gira o hace zoom a mano, se deja de animar (pero se sigue a la perrita enfocada)
  useEffect(() => {
    const c = controls.current
    if (!c) return
    const onStart = () => {
      userTouched.current = true
      resetting.current = false
    }
    c.addEventListener('start', onStart)
    return () => c.removeEventListener('start', onStart)
  }, [])

  useFrame((_, rawDt) => {
    const c = controls.current
    if (!c || (!focus && !resetting.current)) return
    const dt = Math.min(rawDt, 0.05)
    const cam = c.object
    const k = 1 - Math.exp(-dt * 4) // suavizado independiente de los FPS

    let goalZoom
    if (focus) {
      tmp.target.copy(focusPoints[focus])
      goalZoom = zoomRef.current * FOCUS_ZOOM[focus]
      settle.current = Math.max(0, settle.current - dt)
    } else {
      tmp.target.set(...CAM_TARGET)
      goalZoom = zoomRef.current
    }

    // Mueve el objetivo conservando el ángulo de la cámara (o volviendo al inicial si es reset)
    tmp.offset.copy(cam.position).sub(c.target)
    if (resetting.current) tmp.offset.lerp(homeOffset, k)
    c.target.lerp(tmp.target, focus === 'sasha' ? Math.min(1, k * 1.6) : k)
    cam.position.copy(c.target).add(tmp.offset)

    if ((settle.current > 0 || resetting.current) && !userTouched.current) {
      cam.zoom += (goalZoom - cam.zoom) * k
      cam.updateProjectionMatrix()
    }

    if (
      resetting.current &&
      c.target.distanceTo(tmp.target) < 0.02 &&
      Math.abs(cam.zoom - goalZoom) < zoomRef.current * 0.01
    ) {
      resetting.current = false
    }
    c.update()
  })

  const focusOn = (who) => (e) => {
    e.stopPropagation()
    onFocusChange?.(who)
  }

  // Clic (sin arrastrar) en el piso, la escalera o el sofá: Sasha camina hasta ahí
  const sasha = useRef()
  const onSceneClick = (e) => {
    if (e.delta > 6) return // fue un giro de cámara, no un clic
    e.stopPropagation()
    sasha.current?.goTo(e.point.x, e.point.z)
  }

  return (
    <>
      <OrthographicCamera makeDefault position={CAM_POSITION} zoom={zoom} near={-50} far={200} />
      <OrbitControls
        ref={controls}
        target={CAM_TARGET}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={deg(25)}
        maxPolarAngle={deg(78)}
        minZoom={zoom * 0.5}
        maxZoom={zoom * 12}
        // El zoom va hacia el mouse (o entre los dedos), salvo al enfocar a una perrita: ahí se acerca a ella
        zoomToCursor={!focus}
        rotateSpeed={0.6}
      />
      <Lights />

      <group position={[0, -0.6, 0]} onClick={onSceneClick}>
        <Floor />
        <Walls />
        <SpecialPhoto />
        <Tv on={tvOn} onClick={onTvClick} />
        <SecurityCamera position={[SECURITY_CAM.x, SECURITY_CAM.y, -FLOOR_D / 2]} />
        <Sofa position={SOFA.position} />
        <DogStairs position={STAIRS.position} rotation={[0, STAIRS.rotationY, 0]} />
        <Sasha controller={sasha} onDoubleClick={focusOn('sasha')} />
        {/* Bella acostada en el centro del sofá sobre la manta crema, su gusano de peluche
            a la derecha y el montón de mantas morada y marfil atrás a la izquierda */}
        <CreamThrow position={[sx + seatSpots.center[0] + 0.15, SOFA.seatTop - 0.02, sz + seatSpots.center[2] + 0.1]} />
        <Bella
          position={bellaPos}
          scale={BELLA.scale}
          rotation={[0, BELLA.yaw, 0]}
          onDoubleClick={focusOn('bella')}
        />
        <Caterpillar
          length={CATERPILLAR.length}
          position={[sx + CATERPILLAR.offset[0], SOFA.seatTop, sz + CATERPILLAR.offset[1]]}
          rotation={[0, CATERPILLAR.yaw, 0]}
        />
        <PurplePile position={[sx + seatSpots.backLeft[0] - 0.2, SOFA.seatTop - 0.02, sz + seatSpots.backLeft[2]]} />
        <ContactShadows
          position={[0, -0.75, 0]}
          opacity={0.3}
          scale={20}
          blur={2.5}
          far={4}
          resolution={IS_TOUCH ? 256 : 512}
        />
      </group>
    </>
  )
}
