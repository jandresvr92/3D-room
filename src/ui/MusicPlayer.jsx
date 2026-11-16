import { useEffect, useRef, useState } from 'react'

const SONG = `${import.meta.env.BASE_URL}audio/lofi.mp3`
const TITLE = 'Lofi chill'

/**
 * Reproductor de música de fondo: suena por defecto (en bucle) y el botón pausa/reanuda.
 * Los navegadores bloquean el audio hasta que la persona interactúa con la página,
 * así que si el autoplay falla, la música arranca con el primer toque, clic o tecla.
 */
export default function MusicPlayer() {
  const audio = useRef(null)
  const [playing, setPlaying] = useState(false)
  const pausedByUser = useRef(false)

  useEffect(() => {
    const a = new Audio(SONG)
    a.loop = true
    a.volume = 0.45
    audio.current = a
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    a.addEventListener('play', onPlay)
    a.addEventListener('pause', onPause)

    // Intento de autoplay; si el navegador lo bloquea, espera la primera interacción
    const unlock = (e) => {
      // Un toque en el propio botón lo maneja `toggle` (si no, arrancaría y se pausaría a la vez)
      if (e.target.closest?.('.player-btn')) return
      if (!pausedByUser.current && a.paused) a.play().catch(() => {})
      removeUnlock()
    }
    const events = ['pointerdown', 'keydown', 'touchstart']
    const removeUnlock = () => events.forEach((ev) => window.removeEventListener(ev, unlock, true))
    a.play().catch(() => events.forEach((ev) => window.addEventListener(ev, unlock, true)))

    return () => {
      removeUnlock()
      a.pause()
      a.removeEventListener('play', onPlay)
      a.removeEventListener('pause', onPause)
      audio.current = null
    }
  }, [])

  const toggle = () => {
    const a = audio.current
    if (!a) return
    if (a.paused) {
      pausedByUser.current = false
      a.play().catch(() => {})
    } else {
      pausedByUser.current = true
      a.pause()
    }
  }

  return (
    <div className={`player ${playing ? 'on' : ''}`}>
      <button
        className="player-btn"
        onClick={toggle}
        aria-label={playing ? 'Pausar música' : 'Reproducir música'}
        title={playing ? 'Pausar música' : 'Reproducir música'}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" rx="1.2" />
            <rect x="14" y="5" width="4" height="14" rx="1.2" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.2-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
          </svg>
        )}
      </button>
      <div className="player-info">
        <span className="player-kicker">{playing ? 'Sonando' : 'En pausa'}</span>
        <span className="player-title">{TITLE}</span>
      </div>
      <div className="eq" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    </div>
  )
}
