import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import Scene from './scene/Scene'
import Joystick from './ui/Joystick'
import { IS_TOUCH, view } from './input'

export default function App() {
  return (
    <div className="app">
      <Canvas
        shadows
        // En celulares se limita la resolución para que vaya fluido
        dpr={IS_TOUCH ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      <header className="header">
        <h1>Teckels</h1>
        <p>
          {IS_TOUCH
            ? 'Toca para pasear a Sasha · joystick · arrastra para girar · pellizca para zoom'
            : 'Clic para pasear a Sasha · WASD o flechas · arrastra para girar · rueda para zoom'}
        </p>
      </header>

      {IS_TOUCH && <Joystick />}

      <button className="reset-view" onClick={() => view.reset()} aria-label="Volver a la vista inicial" title="Volver a la vista inicial">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" />
        </svg>
      </button>
    </div>
  )
}
