import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import Scene from './scene/Scene'
import { IS_TOUCH, view } from './input'
import MusicPlayer from './ui/MusicPlayer'
import Gallery from './ui/Gallery'

const TV_WARMUP_MS = 800 // la galería se abre cuando la tele termina de encenderse

export default function App() {
  const [tvOn, setTvOn] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const timer = useRef()

  const openTv = useCallback(() => {
    if (tvOn) return
    setTvOn(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setGalleryOpen(true), TV_WARMUP_MS)
  }, [tvOn])

  const closeGallery = useCallback(() => {
    clearTimeout(timer.current)
    setGalleryOpen(false)
    setTvOn(false) // la tele se apaga al cerrar el álbum
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <div className="app">
      <Canvas
        shadows
        // En celulares se limita la resolución para que vaya fluido
        dpr={IS_TOUCH ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      >
        <Suspense fallback={null}>
          <Scene tvOn={tvOn} onTvClick={openTv} />
        </Suspense>
      </Canvas>

      <header className="header">
        <h1>Bella &amp; Sasha, Album</h1>
        <p>
          {IS_TOUCH
            ? 'Toca el piso para pasear a Sasha · toca la tele para ver el álbum · pellizca para zoom'
            : 'Clic para pasear a Sasha · clic en la tele para ver el álbum · WASD o flechas · rueda para zoom'}
        </p>
      </header>

      <MusicPlayer />

      <button
        className="reset-view"
        onClick={() => view.reset()}
        aria-label="Volver a la vista inicial"
        title="Volver a la vista inicial"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" />
        </svg>
      </button>

      <Gallery open={galleryOpen} onClose={closeGallery} />
    </div>
  )
}
