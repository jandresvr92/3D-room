/**
 * Estado compartido entre la interfaz HTML (joystick, botones) y la escena 3D.
 * Son objetos simples que se leen en cada fotograma, sin re-renderizar React.
 */

/** true en celulares y tablets (pantalla táctil sin mouse). */
export const IS_TOUCH =
  typeof window !== 'undefined' && window.matchMedia?.('(hover: none) and (pointer: coarse)').matches

/** Joystick virtual: x a la derecha, y hacia arriba de la pantalla, en el rango -1..1. */
export const joystick = { x: 0, y: 0, active: false }

/** Acciones de la vista que la escena registra y la interfaz llama. */
export const view = { reset: () => {} }
