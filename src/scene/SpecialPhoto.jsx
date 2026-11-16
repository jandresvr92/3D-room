import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import photoUrl from '../assets/especial/foto-especial.jpg'
import { FLOOR_D, WALL } from './layout'

const WIDTH = 8.2 // la foto mide 2048 × 1143 → 8.2 × 4.58 en la escena
const HEIGHT = WIDTH * (1143 / 2048)

/**
 * Easter egg: la "foto especial" pegada en la cara de atrás de la pared del fondo.
 * Desde la vista normal no se ve; aparece solo si giras la cámara hasta quedar detrás de la pared.
 */
export default function SpecialPhoto() {
  const texture = useTexture(photoUrl, (t) => {
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
  })
  const backZ = -FLOOR_D / 2 - WALL.thickness - 0.012 // justo por fuera de la cara trasera
  const centerY = (WALL.bottom + WALL.top) / 2 + 0.25

  return (
    // Girada 180° para que mire hacia afuera (-Z), lejos de la habitación
    <group position={[0, centerY, backZ]} rotation={[0, Math.PI, 0]}>
      {/* Sombra suave detrás, para que parezca una foto pegada y no una calcomanía */}
      <mesh position={[0.06, -0.08, -0.004]}>
        <planeGeometry args={[WIDTH * 0.97, HEIGHT * 0.95]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh rotation={[0, 0, -0.025]}>
        <planeGeometry args={[WIDTH, HEIGHT]} />
        {/* Sin tono de iluminación para que conserve sus colores originales */}
        <meshBasicMaterial map={texture} toneMapped={false} transparent alphaTest={0.01} />
      </mesh>
    </group>
  )
}
