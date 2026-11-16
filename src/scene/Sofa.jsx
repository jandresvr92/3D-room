import { RoundedBox } from '@react-three/drei'
import { CLAY, COLORS } from './clay'
import { SOFA } from './layout'

/** Bloque redondeado con sombras: el "ladrillo" de plastilina con el que se arma todo. */
export function Blob({ size, radius = 0.15, color, material, children, ...props }) {
  return (
    <RoundedBox args={size} radius={radius} smoothness={5} castShadow receiveShadow {...props}>
      <meshStandardMaterial color={color} {...CLAY} {...material} />
      {children}
    </RoundedBox>
  )
}

/** Bulto de tela: esfera aplastada, para pliegues y mantas arrugadas. */
export function Lump({ color, scale, ...props }) {
  return (
    <mesh scale={scale} castShadow receiveShadow {...props}>
      <sphereGeometry args={[1, 24, 16]} />
      <meshStandardMaterial color={color} {...CLAY} />
    </mesh>
  )
}

const { width: W, depth: D, armW, plinthH, baseH, cushionH, armRise, seatTop } = SOFA
const INNER = W - 2 * armW
const BASE_TOP = plinthH + baseH
const ARM_TOP = seatTop + armRise

/** Puntos del asiento (coordenadas locales del sofá) para colocar perritas y mantas. */
export const seatSpots = {
  center: [0, seatTop, 0],
  backLeft: [-INNER / 2 + 1.05, seatTop, -D / 2 + 1.15],
  backRight: [INNER / 2 - 1.0, seatTop, -D / 2 + 0.95],
}

/**
 * Sofá clay sin respaldo (como el de la foto): cuerpo beige sobre zócalo de madera,
 * brazos cuadrados y una manta azul que cubre asiento y brazos y cae por los lados.
 * Origen: centro de su huella en el piso. Frente hacia +Z.
 */
export default function Sofa(props) {
  const frontDropBottom = 0.38
  const sideDropBottom = 0.3

  return (
    <group {...props}>
      {/* Zócalo de madera */}
      <Blob size={[W - 0.2, plinthH, D - 0.2]} radius={0.04} color={COLORS.legs} position={[0, plinthH / 2, 0]} />

      {/* Cuerpo de tela beige (asoma por debajo de la manta) */}
      <Blob size={[W, baseH, D]} radius={0.14} color={COLORS.sofaBase} position={[0, plinthH + baseH / 2, 0]} />

      {/* Colchón del asiento, cubierto por la manta */}
      <Blob
        size={[INNER + 0.1, cushionH, D - 0.05]}
        radius={0.16}
        color={COLORS.blanket}
        position={[0, BASE_TOP + cushionH / 2, 0]}
      />

      {/* Brazos cuadrados de tope plano */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (W / 2 - armW / 2), 0, 0]}>
          <Blob
            size={[armW, ARM_TOP - BASE_TOP + 0.1, D]}
            radius={0.2}
            color={COLORS.blanket}
            position={[0, BASE_TOP - 0.1 + (ARM_TOP - BASE_TOP + 0.1) / 2, 0]}
          />
          {/* Manta cayendo por el lado exterior del brazo */}
          <Blob
            size={[0.1, ARM_TOP - sideDropBottom - 0.15, D * 0.82]}
            radius={0.04}
            color={COLORS.blanket}
            position={[s * (armW / 2 + 0.04), sideDropBottom + (ARM_TOP - sideDropBottom - 0.15) / 2, 0.05]}
          />
        </group>
      ))}

      {/* Manta cayendo por el frente */}
      <Blob
        size={[W - 0.3, seatTop - frontDropBottom - 0.1, 0.1]}
        radius={0.04}
        color={COLORS.blanket}
        position={[0, frontDropBottom + (seatTop - frontDropBottom - 0.1) / 2, D / 2 + 0.04]}
      />
    </group>
  )
}
