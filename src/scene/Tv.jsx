import { Blob } from './Sofa'
import { COLORS } from './clay'
import { FLOOR_D, TV } from './layout'

/** Televisor de pantalla plana colgado en la pared del fondo. */
export default function Tv() {
  const { width: w, height: h, centerX, centerY } = TV
  const z = -FLOOR_D / 2

  return (
    <group position={[centerX, centerY, z]}>
      {/* Soporte de pared */}
      <Blob size={[0.9, 0.6, 0.12]} radius={0.04} color={COLORS.tvFrame} position={[0, 0, 0.06]} />
      {/* Cuerpo y marco */}
      <Blob size={[w, h, 0.16]} radius={0.07} color={COLORS.tvFrame} position={[0, 0, 0.2]} />
      {/* Pantalla apagada, un poco satinada */}
      <mesh position={[0, 0.03, 0.285]}>
        <planeGeometry args={[w - 0.18, h - 0.24]} />
        <meshStandardMaterial color={COLORS.tvScreen} roughness={0.35} metalness={0} />
      </mesh>
      {/* Reflejo diagonal suave */}
      <mesh position={[-w * 0.18, h * 0.12, 0.29]} rotation={[0, 0, -0.6]}>
        <planeGeometry args={[0.25, h * 0.9]} />
        <meshBasicMaterial color={COLORS.tvGlare} transparent opacity={0.35} />
      </mesh>
      {/* Lucecita de encendido */}
      <mesh position={[w / 2 - 0.25, -h / 2 + 0.06, 0.285]}>
        <circleGeometry args={[0.025, 12]} />
        <meshBasicMaterial color="#ff5a4f" />
      </mesh>
    </group>
  )
}
