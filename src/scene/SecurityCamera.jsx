import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Blob } from './Sofa'
import { CLAY, COLORS } from './clay'

const PAN = 0.85 // giro máximo a cada lado (≈ 50°)
const PERIOD = 7 // segundos que tarda en ir y volver
const TILT = -0.45 // mira un poco hacia abajo, al piso

/**
 * Cámara de vigilancia de pared que barre la habitación de izquierda a derecha,
 * con una pausa en cada extremo, como si vigilara a las perritas.
 * Origen: punto de la pared donde va atornillada; el frente mira hacia +Z.
 */
export default function SecurityCamera(props) {
  const pan = useRef()
  const led = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // Seno "aplanado": se queda un momento quieta en cada extremo antes de volver
    const s = Math.max(-1, Math.min(1, Math.sin((t / PERIOD) * Math.PI * 2) * 1.6))
    pan.current.rotation.y = s * PAN
    // Lucecita roja que parpadea
    led.current.material.emissiveIntensity = Math.sin(t * 4) > 0.3 ? 2.2 : 0.2
  })

  return (
    <group {...props}>
      {/* Base atornillada a la pared */}
      <Blob size={[0.55, 0.55, 0.1]} radius={0.05} color={COLORS.camBody} position={[0, 0, 0.05]} />
      {/* Brazo */}
      <mesh position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.45, 14]} />
        <meshStandardMaterial color={COLORS.camBody} {...CLAY} />
      </mesh>

      {/* Rótula que gira (paneo) */}
      <group ref={pan} position={[0, 0, 0.55]}>
        <mesh castShadow>
          <sphereGeometry args={[0.12, 18, 14]} />
          <meshStandardMaterial color={COLORS.camDark} {...CLAY} />
        </mesh>

        {/* Cuerpo, inclinado hacia abajo */}
        <group rotation={[-TILT, 0, 0]} position={[0, -0.05, 0.25]}>
          <Blob size={[0.42, 0.38, 0.8]} radius={0.14} color={COLORS.camBody} />
          {/* Visera */}
          <Blob size={[0.5, 0.06, 0.85]} radius={0.03} color={COLORS.camBody} position={[0, 0.22, 0.06]} />
          {/* Lente */}
          <mesh position={[0, -0.01, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.14, 0.06, 24]} />
            <meshStandardMaterial color={COLORS.camDark} {...CLAY} />
          </mesh>
          <mesh position={[0, -0.01, 0.435]}>
            <sphereGeometry args={[0.09, 20, 14]} />
            <meshStandardMaterial color={COLORS.camLens} roughness={0.2} metalness={0.2} />
          </mesh>
          {/* Brillo del lente */}
          <mesh position={[-0.03, 0.03, 0.52]}>
            <sphereGeometry args={[0.018, 10, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* LED de grabación */}
          <mesh ref={led} position={[0.13, 0.11, 0.41]}>
            <sphereGeometry args={[0.025, 10, 8]} />
            <meshStandardMaterial color="#ff4a3d" emissive="#ff2a1d" emissiveIntensity={2} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
