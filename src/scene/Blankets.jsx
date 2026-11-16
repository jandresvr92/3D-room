import { Blob, Lump } from './Sofa'
import { COLORS } from './clay'

/** Manta crema estampada, extendida y arrugada: la cama de Bella. Origen: centro, sobre el asiento. */
export function CreamThrow(props) {
  return (
    <group {...props}>
      <Blob size={[2.1, 0.1, 2.5]} radius={0.05} color={COLORS.throwCream} position={[0, 0.05, 0.1]} rotation={[0, 0.08, 0]} />
      {/* Arrugas */}
      <Lump color={COLORS.throwCream} position={[0.7, 0.08, 1.1]} scale={[0.5, 0.07, 0.22]} rotation={[0, 0.3, 0]} />
      <Lump color={COLORS.throwCream} position={[-0.6, 0.07, 1.2]} scale={[0.45, 0.06, 0.18]} rotation={[0, -0.2, 0]} />
      <Lump color={COLORS.throwCream} position={[0.95, 0.07, -0.2]} scale={[0.18, 0.06, 0.55]} />
      {/* Letras del estampado, sugeridas con trazos café */}
      {[-0.45, 0, 0.45].map((x, i) => (
        <Blob key={i} size={[0.28, 0.02, 0.08]} radius={0.01} color={COLORS.throwPrint} position={[x, 0.105, 0.95]} rotation={[0, 0.08, 0]} />
      ))}
    </group>
  )
}

/** Manta morada hecha bola, con manchas lima y rosa, más una manta marfil al lado. */
export function PurplePile(props) {
  return (
    <group {...props}>
      <Lump color={COLORS.throwPurple} position={[0.15, 0.25, 0.1]} scale={[0.75, 0.3, 0.65]} />
      <Lump color={COLORS.throwPurple} position={[0.55, 0.32, -0.25]} scale={[0.45, 0.32, 0.45]} />
      <Lump color={COLORS.throwPurple} position={[-0.25, 0.16, 0.55]} scale={[0.5, 0.18, 0.35]} />
      {[
        [0.0, 0.53, 0.05, COLORS.throwLime],
        [0.55, 0.62, -0.2, COLORS.throwPink],
        [-0.35, 0.32, 0.55, COLORS.throwLime],
        [0.6, 0.3, 0.35, COLORS.throwPink],
      ].map(([x, y, z, c], i) => (
        <Lump key={i} color={c} position={[x, y, z]} scale={[0.13, 0.05, 0.1]} rotation={[0.3, i, 0]} />
      ))}
      {/* Manta marfil arrugada junto a la morada */}
      <Lump color={COLORS.throwIvory} position={[-0.75, 0.22, -0.3]} scale={[0.55, 0.24, 0.45]} />
      <Lump color={COLORS.throwIvory} position={[-1.05, 0.08, 0.15]} scale={[0.45, 0.1, 0.3]} />
    </group>
  )
}
