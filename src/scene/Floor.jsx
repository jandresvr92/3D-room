import { useMemo } from 'react'
import { Instances, Instance } from '@react-three/drei'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { CLAY, COLORS } from './clay'
import { TILE, FLOOR_X, FLOOR_Z, FLOOR_W, FLOOR_D, FLOOR_TOP } from './layout'

const TILE_H = 0.16
const GAP = 0.09 // ancho de la junta
const SLAB_H = 0.55

/** Piso de cerámica blanca a cuadros: baldosas "de plastilina" sobre una base con canto. */
export default function Floor() {
  const tileGeo = useMemo(() => new RoundedBoxGeometry(TILE - GAP, TILE_H, TILE - GAP, 3, 0.06), [])

  const tiles = useMemo(() => {
    const list = []
    for (let i = 0; i < FLOOR_X; i++) {
      for (let j = 0; j < FLOOR_Z; j++) {
        list.push({
          position: [(i - FLOOR_X / 2 + 0.5) * TILE, FLOOR_TOP - TILE_H / 2, (j - FLOOR_Z / 2 + 0.5) * TILE],
          color: (i + j) % 2 === 0 ? COLORS.tileA : COLORS.tileB,
        })
      }
    }
    return list
  }, [])

  const W = FLOOR_W
  const D = FLOOR_D

  return (
    <group>
      <Instances limit={tiles.length} geometry={tileGeo} receiveShadow castShadow>
        {/* Un poco de emisión blanca para que la luz cálida no las vuelva beige */}
        <meshStandardMaterial {...CLAY} roughness={0.7} emissive="#ffffff" emissiveIntensity={0.18} />
        {tiles.map((t, i) => (
          <Instance key={i} position={t.position} color={t.color} />
        ))}
      </Instances>

      {/* Juntas: placa gris cálida que asoma entre baldosas */}
      <mesh position={[0, FLOOR_TOP - TILE_H * 0.7, 0]} receiveShadow>
        <boxGeometry args={[W, TILE_H * 0.6, D]} />
        <meshStandardMaterial color={COLORS.grout} {...CLAY} />
      </mesh>

      {/* Canto del piso (corte del diorama) */}
      <mesh position={[0, FLOOR_TOP - TILE_H - SLAB_H / 2 + 0.02, 0]} receiveShadow>
        <boxGeometry args={[W + 0.1, SLAB_H, D + 0.1]} />
        <meshStandardMaterial color={COLORS.slab} {...CLAY} />
      </mesh>
      <mesh position={[0, FLOOR_TOP - TILE_H - SLAB_H - 0.05, 0]}>
        <boxGeometry args={[W - 0.1, 0.12, D - 0.1]} />
        <meshStandardMaterial color={COLORS.slabDark} {...CLAY} />
      </mesh>
    </group>
  )
}
