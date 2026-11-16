import { CLAY, COLORS } from './clay'

const SEGMENTS = [
  COLORS.catGreen,
  COLORS.catPink,
  COLORS.catMagenta,
  COLORS.catBlue,
  COLORS.catLilac,
  COLORS.catLime,
]

function Ball({ color, position, scale, rotation }) {
  return (
    <mesh position={position} scale={scale} rotation={rotation} castShadow receiveShadow>
      <sphereGeometry args={[1, 28, 20]} />
      <meshStandardMaterial color={color} {...CLAY} />
    </mesh>
  )
}

/**
 * Gusano de peluche (juguete de las perritas), en estilo clay.
 * Se arma a lo largo de +X con la cabeza en la punta +X; mide `length` de largo.
 * Origen: centro de su largo, apoyado en Y = 0.
 */
export default function Caterpillar({ length = 2.2, ...props }) {
  const r = length * 0.105 // radio de cada segmento (gordito, como el peluche)
  const headR = r * 1.35
  const pitch = r * 1.45 // separación entre segmentos (se solapan, como el peluche relleno)
  const bodyLen = pitch * (SEGMENTS.length - 1) + 2 * r + headR * 1.6
  const s = length / bodyLen // ajusta todo para que mida exactamente `length`
  const tailX = -bodyLen / 2 + r // centro del último segmento (sin escalar)
  const headX = bodyLen / 2 - headR * 0.8

  return (
    <group {...props}>
      <group scale={s}>
        {/* Segmentos de colores, de la cola hacia la cabeza */}
        {SEGMENTS.map((color, i) => {
          const x = tailX + i * pitch
          return (
            <group key={i} position={[x, r * 0.92, 0]}>
              <Ball color={color} position={[0, 0, 0]} scale={[r * 0.95, r * 0.92, r]} />
              {/* Patitas rojas a cada lado */}
              {[-1, 1].map((side) => (
                <Ball
                  key={side}
                  color={COLORS.catRed}
                  position={[r * 0.15, -r * 0.62, side * r * 0.82]}
                  scale={[r * 0.16, r * 0.14, r * 0.38]}
                  rotation={[side * 0.5, 0, 0]}
                />
              ))}
            </group>
          )
        })}

        {/* Cabeza */}
        <group position={[headX, headR * 0.95, 0]}>
          <Ball color={COLORS.catYellow} position={[0, 0, 0]} scale={[headR * 0.9, headR, headR * 1.02]} />
          {/* Ojos */}
          {[-1, 1].map((side) => (
            <Ball
              key={side}
              color={COLORS.catEye}
              position={[headR * 0.84, headR * 0.28, side * headR * 0.3]}
              scale={[headR * 0.05, headR * 0.09, headR * 0.06]}
            />
          ))}
          {/* Nariz roja */}
          <Ball color={COLORS.catRed} position={[headR * 0.9, -headR * 0.05, 0]} scale={[headR * 0.14, headR * 0.15, headR * 0.22]} />
          {/* Sonrisa */}
          <mesh position={[headR * 0.8, -headR * 0.2, 0]} rotation={[0, Math.PI / 2, Math.PI]}>
            <torusGeometry args={[headR * 0.38, headR * 0.035, 8, 24, Math.PI * 0.8]} />
            <meshStandardMaterial color={COLORS.catEye} {...CLAY} />
          </mesh>
          {/* Antenas con pompones */}
          {[-1, 1].map((side) => (
            <group key={side} position={[0, headR * 0.8, side * headR * 0.42]} rotation={[side * 0.35, 0, -0.15]}>
              <mesh position={[0, headR * 0.35, 0]} castShadow>
                <cylinderGeometry args={[headR * 0.1, headR * 0.12, headR * 0.7, 10]} />
                <meshStandardMaterial color={COLORS.catYellow} {...CLAY} />
              </mesh>
              <Ball color={COLORS.catRed} position={[0, headR * 0.78, 0]} scale={headR * 0.26} />
            </group>
          ))}
        </group>
      </group>
    </group>
  )
}
