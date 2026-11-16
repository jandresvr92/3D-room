import { Blob } from './Sofa'
import { COLORS } from './clay'
import { FLOOR_W, FLOOR_D, WALL } from './layout'

const { thickness: T, bottom: BOTTOM, top: TOP } = WALL
// Un poco de emisión blanca para que la sombra no las vuelva beige (igual que las baldosas)
const WALL_MAT = { emissive: '#ffffff', emissiveIntensity: 0.22 }

const FACE_Z = -FLOOR_D / 2 // cara interior de la pared

/** Panel de madera sólido en la parte derecha de la pared, sin llegar al techo, con perilla a la izquierda. */
function WoodPanel() {
  const { width: w, height: h, rightMargin } = WALL.wood
  const x = FLOOR_W / 2 - rightMargin - w / 2
  const depth = 0.16

  return (
    <group position={[x, 0, FACE_Z]}>
      <Blob size={[w, h, depth]} radius={0.05} color={COLORS.wood} position={[0, h / 2, depth / 2]} />
      {/* Perilla: base redonda + pomo */}
      <group position={[-w / 2 + 0.38, h * 0.48, depth]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.06, 20]} />
          <meshStandardMaterial color={COLORS.knob} roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.16]} castShadow>
          <sphereGeometry args={[0.13, 20, 14]} />
          <meshStandardMaterial color={COLORS.knob} roughness={0.5} metalness={0.3} />
        </mesh>
      </group>
    </group>
  )
}

/** Pared del fondo (-Z), detrás del sofá, con revestimiento de madera a la derecha. */
export default function Walls() {
  const h = TOP - BOTTOM
  return (
    <group>
      <Blob
        size={[FLOOR_W, h, T]}
        radius={0.1}
        color={COLORS.wall}
        material={WALL_MAT}
        position={[0, BOTTOM + h / 2, FACE_Z - T / 2]}
      />
      <WoodPanel />
    </group>
  )
}
