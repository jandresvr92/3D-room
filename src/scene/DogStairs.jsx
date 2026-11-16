import { Blob } from './Sofa'
import { COLORS } from './clay'
import { SOFA, STAIRS } from './layout'

/**
 * Escalera acolchada para perritas (gris carbón, como la de la foto).
 * Cada escalón es un bloque de espuma independiente con el borde superior bien redondeado.
 * Origen: punto del piso pegado al frente del sofá. Los escalones bajan hacia +Z.
 */
export default function DogStairs(props) {
  const { steps, width, stepDepth } = STAIRS
  const rise = SOFA.seatTop / steps

  return (
    <group {...props}>
      {Array.from({ length: steps }, (_, k) => {
        const h = rise * (k + 1)
        const z = (steps - k - 0.5) * stepDepth
        return (
          <group key={k}>
            {/* Cuerpo del escalón, macizo hasta el piso */}
            <Blob size={[width, h, stepDepth - 0.03]} radius={0.06} color={COLORS.stairs} position={[0, h / 2, z]} />
            {/* Almohadilla superior, con el canto delantero redondeado */}
            <Blob
              size={[width + 0.02, Math.min(0.32, h), stepDepth + 0.01]}
              radius={0.14}
              color={COLORS.stairsTop}
              position={[0, h - Math.min(0.32, h) / 2 + 0.02, z]}
            />
          </group>
        )
      })}
    </group>
  )
}
