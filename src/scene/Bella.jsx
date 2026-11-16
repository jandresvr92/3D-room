import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Center, useGLTF } from '@react-three/drei'
import { makeClay } from './clay'

const URL = `${import.meta.env.BASE_URL}models/bella.glb`

/** Bella, la perrita acostada. El origen del grupo es su panza (Y = 0) gracias a <Center top>. */
export default function Bella(props) {
  const { scene } = useGLTF(URL)
  const body = useRef()

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return
      child.castShadow = true
      child.receiveShadow = true
      const mats = Array.isArray(child.material) ? child.material : [child.material]
      mats.forEach((m) => m && makeClay(m))
    })
  }, [scene])

  // Respiración lenta de perrita dormida
  useFrame((state) => {
    const b = Math.sin(state.clock.elapsedTime * 1.6)
    body.current.scale.set(1 + b * 0.012, 1 + b * 0.025, 1)
  })

  return (
    <group {...props}>
      <group ref={body}>
        <Center top>
          <primitive object={scene} />
        </Center>
      </group>
    </group>
  )
}

useGLTF.preload(URL)
