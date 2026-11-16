import { useRef } from 'react'
import { joystick } from '../input'

const RADIUS = 48 // recorrido máximo de la perilla, en píxeles

/** Joystick táctil para pasear a Sasha. Escribe en `joystick` (input.js), que Sasha lee cada fotograma. */
export default function Joystick() {
  const base = useRef()
  const knob = useRef()
  const center = useRef({ x: 0, y: 0 })

  const move = (e) => {
    let dx = e.clientX - center.current.x
    let dy = e.clientY - center.current.y
    const len = Math.hypot(dx, dy)
    if (len > RADIUS) {
      dx = (dx / len) * RADIUS
      dy = (dy / len) * RADIUS
    }
    knob.current.style.transform = `translate(${dx}px, ${dy}px)`
    joystick.x = dx / RADIUS
    joystick.y = -dy / RADIUS
  }

  const start = (e) => {
    const r = base.current.getBoundingClientRect()
    center.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    try {
      base.current.setPointerCapture(e.pointerId) // sigue al dedo aunque salga del círculo
    } catch {
      // algunos navegadores no permiten capturar el puntero; el joystick funciona igual
    }
    joystick.active = true
    base.current.classList.add('on')
    move(e)
  }

  const end = () => {
    joystick.active = false
    joystick.x = joystick.y = 0
    knob.current.style.transform = ''
    base.current.classList.remove('on')
  }

  return (
    <div
      ref={base}
      className="joystick"
      onPointerDown={start}
      onPointerMove={(e) => joystick.active && move(e)}
      onPointerUp={end}
      onPointerCancel={end}
      aria-label="Joystick para mover a Sasha"
    >
      <div ref={knob} className="joystick-knob" />
    </div>
  )
}
