import { useEffect, useState } from 'react'

// Todas las fotos de src/assets/album: para agregar una, basta con copiarla ahí
const files = import.meta.glob('../assets/album/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
})

/** Fotos ordenadas por el número del nombre ("salchis (2)" antes que "salchis (10)"). */
const PHOTOS = Object.entries(files)
  .map(([path, url]) => ({ name: path.split('/').pop(), url }))
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))

/**
 * Galería tipo Pinterest "Salchipin": columnas de fotos de distintas alturas.
 * Tocar una foto la abre en grande; flechas o deslizar para pasar, Esc para cerrar.
 */
export default function Gallery({ open, onClose }) {
  const [current, setCurrent] = useState(null) // índice de la foto ampliada

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (current !== null) setCurrent(null)
        else onClose()
      }
      if (current === null) return
      if (e.key === 'ArrowRight') setCurrent((i) => (i + 1) % PHOTOS.length)
      if (e.key === 'ArrowLeft') setCurrent((i) => (i - 1 + PHOTOS.length) % PHOTOS.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, current, onClose])

  useEffect(() => {
    if (!open) setCurrent(null)
  }, [open])

  if (!open) return null

  const step = (d) => setCurrent((i) => (i + d + PHOTOS.length) % PHOTOS.length)

  // Deslizar con el dedo en la foto ampliada
  let touchX = null
  const onTouchStart = (e) => (touchX = e.touches[0].clientX)
  const onTouchEnd = (e) => {
    if (touchX === null) return
    const dx = e.changedTouches[0].clientX - touchX
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1)
    touchX = null
  }

  return (
    <div className="gallery-backdrop" onClick={onClose}>
      <section className="gallery" onClick={(e) => e.stopPropagation()} aria-label="Salchipin, álbum de fotos">
        <header className="gallery-head">
          <div>
            <h2 className="gallery-title">Salchipin</h2>
            <p className="gallery-sub">
              {PHOTOS.length} {PHOTOS.length === 1 ? 'foto' : 'fotos'} de Bella &amp; Sasha
            </p>
          </div>
          <button className="gallery-close" onClick={onClose} aria-label="Cerrar álbum" title="Cerrar">
            ✕
          </button>
        </header>

        {PHOTOS.length === 0 ? (
          <p className="gallery-empty">
            Todavía no hay fotos. Agrégalas en <code>src/assets/album</code>.
          </p>
        ) : (
          <div className="masonry">
            {PHOTOS.map((p, i) => (
              <button
                key={p.name}
                className="pin"
                style={{ animationDelay: `${Math.min(i, 12) * 45}ms` }}
                onClick={() => setCurrent(i)}
                aria-label={`Ver foto ${i + 1}`}
              >
                <img src={p.url} alt={`Bella y Sasha, foto ${i + 1}`} loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        )}
      </section>

      {current !== null && (
        <div
          className="lightbox"
          onClick={(e) => (e.stopPropagation(), setCurrent(null))}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <img
            key={current}
            src={PHOTOS[current].url}
            alt={`Bella y Sasha, foto ${current + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lightbox-nav prev"
            onClick={(e) => (e.stopPropagation(), step(-1))}
            aria-label="Foto anterior"
          >
            ‹
          </button>
          <button
            className="lightbox-nav next"
            onClick={(e) => (e.stopPropagation(), step(1))}
            aria-label="Foto siguiente"
          >
            ›
          </button>
          <span className="lightbox-count">
            {current + 1} / {PHOTOS.length}
          </span>
        </div>
      )}
    </div>
  )
}
