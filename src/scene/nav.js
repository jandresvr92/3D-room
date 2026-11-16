/**
 * Navegación de Sasha: mapa de alturas de la habitación, obstáculos y rutas.
 * Todo en coordenadas del grupo de la escena (X/Z horizontales, Y = 0 en la cara del piso).
 */
import { FLOOR_W, FLOOR_D, SOFA, SOFA_FRONT, STAIRS, BELLA, CATERPILLAR, seatSpots } from './layout'

export const BLOCKED = Infinity
/** Desnivel máximo que el centro del cuerpo puede subir o bajar de un paso (un escalón ≈ 0.33). */
export const MAX_STEP = 0.45
/** Desnivel máximo tolerado entre el centro y la nariz (permite ver dos escalones por delante). */
export const MAX_REACH = 0.75
/** Cuánto se achican los obstáculos para la nariz (puede tocar a Bella olfateándola). */
export const NOSE_SHRINK = 0.5

const [sx, , sz] = SOFA.position
const SW = SOFA.width
const SD = SOFA.depth
const INNER = SW - 2 * SOFA.armW
const [px, , pz] = STAIRS.position
const N = STAIRS.steps
const STEP_D = STAIRS.stepDepth
const RISE = SOFA.seatTop / N
const STAIRS_W = STAIRS.width

const WALL_MARGIN = 0.35 // para que el cuerpo no atraviese bordes ni la pared
const SEAT_SIDE_MARGIN = 0.35 // separación de los brazos del sofá
const SEAT_BACK_MARGIN = 0.45 // separación del borde trasero del asiento

/** Círculos a lo largo de un cuerpo alargado (centro, dirección, largo, radio). */
const along = (cx, cz, dx, dz, length, r) =>
  [-0.33, 0, 0.33].map((f) => ({ x: cx + dx * f * length, z: cz + dz * f * length, r }))

/** Cosas sobre el asiento que Sasha rodea: Bella, su gusano de peluche y el montón de mantas. */
export const obstacles = [
  ...along(sx + seatSpots.center[0], sz + seatSpots.center[2], Math.sin(BELLA.yaw), Math.cos(BELLA.yaw), BELLA.length, BELLA.width * 0.4),
  // El gusano se arma a lo largo de su +X local
  ...along(sx + CATERPILLAR.offset[0], sz + CATERPILLAR.offset[1], Math.cos(CATERPILLAR.yaw), -Math.sin(CATERPILLAR.yaw), CATERPILLAR.length, 0.4),
  { x: sx + seatSpots.backLeft[0] - 0.2, z: sz + seatSpots.backLeft[2], r: 0.9 },
]

const inStairs = (x, z) => x >= px - N * STEP_D && x <= px && z >= pz - STAIRS_W / 2 && z <= pz + STAIRS_W / 2
const inSofa = (x, z) => x >= sx - SW / 2 && x <= sx + SW / 2 && z >= sz - SD / 2 && z <= SOFA_FRONT + 0.1

/**
 * Altura de la superficie donde se puede pisar en (x, z), o BLOCKED si no se puede estar ahí.
 * `shrink` achica los obstáculos (Bella, mantas): la nariz puede acercarse a olfatear aunque el cuerpo no.
 */
export function heightAt(x, z, shrink = 0) {
  if (Math.abs(x) > FLOOR_W / 2 - WALL_MARGIN || Math.abs(z) > FLOOR_D / 2 - WALL_MARGIN) return BLOCKED

  if (inStairs(x, z)) {
    const k = N - 1 - Math.floor((px - x) / STEP_D)
    return RISE * (Math.min(N - 1, Math.max(0, k)) + 1)
  }

  if (inSofa(x, z)) {
    const onSeat = Math.abs(x - sx) <= INNER / 2 - SEAT_SIDE_MARGIN && z >= sz - SD / 2 + SEAT_BACK_MARGIN
    if (!onSeat) return BLOCKED // brazos y bordes
    for (const o of obstacles) if (Math.hypot(x - o.x, z - o.z) < o.r - shrink) return BLOCKED
    return SOFA.seatTop
  }

  return 0
}

/** Zona de un punto, para planear rutas. */
export function zoneAt(x, z) {
  if (inStairs(x, z)) return 'stairs'
  if (inSofa(x, z)) return 'seat'
  // Pasillo entre el sofá y la pared: solo se sale rodeando el sofá por la derecha
  if (z < sz - SD / 2 && x < sx + SW / 2 + 0.5) return 'behind'
  return 'floor'
}

// Puntos de paso para subir/bajar del sofá por la escalera
// (al pie, algo adelantado: así la nariz no choca con el brazo del sofá ni con el borde del piso)
const STAIR_OUT = [px - N * STEP_D - 0.3, pz + STAIRS_W / 2 + 1.2] // frente a la escalera, sin rozarla de lado
const STAIR_BOTTOM = [px - N * STEP_D - 0.3, pz + 0.45] // al pie del primer escalón
const STAIR_TOP = [px - STEP_D / 2, pz] // escalón más alto
const SEAT_ENTRY = [px - STEP_D / 2, SOFA_FRONT - 0.45] // ya sobre el asiento, en el borde delantero

const ROUTES = {
  'floor>seat': [STAIR_OUT, STAIR_BOTTOM, STAIR_TOP, SEAT_ENTRY],
  'floor>stairs': [STAIR_OUT, STAIR_BOTTOM],
  'stairs>floor': [STAIR_BOTTOM, STAIR_OUT],
  'stairs>seat': [STAIR_TOP, SEAT_ENTRY],
  'seat>stairs': [SEAT_ENTRY, STAIR_TOP],
  'seat>floor': [SEAT_ENTRY, STAIR_TOP, STAIR_BOTTOM, STAIR_OUT],
}

// Rodeo por la derecha del sofá para entrar/salir del pasillo de atrás
const SIDE_X = sx + SW / 2 + 1.0
const BEHIND_EXIT = [SIDE_X, (sz - SD / 2 - FLOOR_D / 2) / 2]
const SIDE_FRONT = [SIDE_X, SOFA_FRONT + 0.8]

/** Lista de puntos [x, z] para ir de `from` a `to`, rodeando el sofá y usando la escalera si hace falta. */
export function planRoute(from, to) {
  let a = zoneAt(...from)
  let b = zoneAt(...to)
  if (a === 'behind' && b === 'behind') return [to]
  const pre = []
  const post = []
  if (a === 'behind') {
    pre.push(BEHIND_EXIT, SIDE_FRONT)
    a = 'floor'
  }
  if (b === 'behind') {
    post.push(SIDE_FRONT, BEHIND_EXIT)
    b = 'floor'
  }
  const middle = a === b ? [] : (ROUTES[`${a}>${b}`] ?? [])
  return [...pre, ...middle, ...post, to]
}
