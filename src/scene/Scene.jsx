import { useEffect, useRef } from 'react'
import { IS_TOUCH, view } from '../input'
import { OrthographicCamera, OrbitControls, ContactShadows } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import Floor from './Floor'
import Walls from './Walls'
import Tv from './Tv'
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

export default function Scene() {
  const { size } = useThree()
  // Zoom responsivo para que la habitación quepa en cualquier pantalla.
  // En vertical (celular) se acerca más: las esquinas del piso pueden quedar un poco fuera,
  // pero la habitación se ve grande en vez de ocupar solo una franja.
  const portrait = size.width / size.height < 0.8
  const zoom = portrait ? size.width / 16 : Math.min(size.width, size.height * 1.05) / 21.5

  // Botón "vista inicial": vuelve a la posición, el objetivo y el zoom de partida
  const controls = useRef()
  const zoomRef = useRef(zoom)
  zoomRef.current = zoom
  useEffect(() => {
    view.reset = () => {
      const c = controls.current
      if (!c) return
      c.target.set(...CAM_TARGET)
      c.object.position.set(...CAM_POSITION)
      c.object.zoom = zoomRef.current
      c.object.updateProjectionMatrix()
      c.update()
    }
  }, [])

  const [sx, , sz] = SOFA.position

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
        maxZoom={zoom * 8}
        zoomToCursor // el zoom se acerca hacia donde apunta el mouse (o entre los dedos al pellizcar)
        rotateSpeed={0.6}
      />
      <Lights />

      <group position={[0, -0.6, 0]} onClick={onSceneClick}>
        <Floor />
        <Walls />
        <Tv />
        <SecurityCamera position={[SECURITY_CAM.x, SECURITY_CAM.y, -FLOOR_D / 2]} />
        <Sofa position={SOFA.position} />
        <DogStairs position={STAIRS.position} rotation={[0, STAIRS.rotationY, 0]} />
        <Sasha controller={sasha} />
        {/* Bella acostada en el centro del sofá sobre la manta crema, su gusano de peluche
            a la derecha y el montón de mantas morada y marfil atrás a la izquierda */}
        <CreamThrow position={[sx + seatSpots.center[0] + 0.15, SOFA.seatTop - 0.02, sz + seatSpots.center[2] + 0.1]} />
        <Bella position={[sx + seatSpots.center[0], SOFA.seatTop + 0.06, sz + seatSpots.center[2]]} scale={BELLA.scale} rotation={[0, BELLA.yaw, 0]} />
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
