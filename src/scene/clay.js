/**
 * Paleta y ajustes del acabado "clay" (plastilina mate), compartidos por toda la escena.
 * Mismo criterio que Nico's Roadmap: color sólido, rugosidad alta y sin metal.
 */
export const CLAY = { roughness: 0.9, metalness: 0 }

export const COLORS = {
  tileA: '#ffffff', // cerámica blanca
  tileB: '#f8f6f3', // casi igual, apenas más cálida (para leer el cuadriculado)
  grout: '#d8cfc6', // juntas
  wall: '#f4eee6', // paredes blanco cálido
  wood: '#bba07c', // revestimiento de madera
  knob: '#d8b25a', // perilla dorada
  tvFrame: '#2b2c31',
  tvScreen: '#161b26',
  tvGlare: '#3a4560',
  slab: '#e6d3bf', // canto del piso
  slabDark: '#c9ad92',
  sofaBase: '#e3d6c0', // tela beige del cuerpo del sofá
  legs: '#c4945e', // zócalo de madera
  blanket: '#86a2dc', // manta azul polar
  stairs: '#4c5059', // escalera de tela gris carbón (tono frío para que la luz cálida no la vuelva café)
  stairsTop: '#5a5e68',
  throwCream: '#f1e3c6', // manta crema (debajo de Bella)
  throwPrint: '#7a5b45', // estampado café de esa manta
  throwPurple: '#7d4fb8', // manta morada
  throwLime: '#c9e04c',
  throwPink: '#ee5aa8',
  throwIvory: '#f6eedd', // manta marfil arrugada
  // Cámara de vigilancia
  camBody: '#f1efea',
  camDark: '#34363d',
  camLens: '#1b2a3c',
  // Gusano de peluche
  catYellow: '#f8dc3c',
  catGreen: '#a8dc6c',
  catPink: '#ffa3cb',
  catMagenta: '#f37fbf',
  catBlue: '#8fcdf2',
  catLilac: '#f2c8e6',
  catLime: '#e8ef7c',
  catRed: '#e8323e',
  catEye: '#2a2228',
}

/** Deja mate un material de modelo GLB generado con IA (quita mapas metal/rugosidad). */
export function makeClay(material) {
  material.roughness = 0.85
  material.metalness = 0.05
  material.metalnessMap = null
  material.roughnessMap = null
  material.needsUpdate = true
}
