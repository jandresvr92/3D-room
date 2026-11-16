import * as THREE from 'three'

/**
 * Estado compartido entre la interfaz HTML (botones) y la escena 3D.
 * Son objetos simples que se leen en cada fotograma, sin re-renderizar React.
 */

/** true en celulares y tablets (pantalla táctil sin mouse). */
export const IS_TOUCH =
  typeof window !== 'undefined' && window.matchMedia?.('(hover: none) and (pointer: coarse)').matches

/** Acciones de la vista que la escena registra y la interfaz llama. */
export const view = { reset: () => {} }

/**
 * Dónde mirar para enfocar a cada perrita (coordenadas del mundo, a la altura de su cuerpo).
 * Bella se fija una vez; la de Sasha se actualiza cada fotograma mientras camina.
 */
export const focusPoints = {
  bella: new THREE.Vector3(),
  sasha: new THREE.Vector3(),
}
