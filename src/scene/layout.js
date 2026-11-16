/**
 * Medidas de la habitación (1 unidad ≈ 30 cm).
 * Centralizadas para que sofá, escalera y perritas encajen entre sí.
 */
export const TILE = 3 // cada baldosa equivale a 3 × 3 de las baldosas pequeñas originales
export const FLOOR_X = 5 // baldosas a lo ancho
export const FLOOR_Z = 5 // baldosas a lo profundo
export const FLOOR_W = FLOOR_X * TILE // 15
export const FLOOR_D = FLOOR_Z * TILE // 15
export const FLOOR_TOP = 0 // cara superior de las baldosas

/** Pared del fondo: blanca a la izquierda (con el televisor) y de madera a la derecha. */
export const WALL = {
  thickness: 0.4,
  bottom: -0.71, // a ras con la base del piso
  top: 7.5, // ≈ 2.25 m
  // Panel de madera sólido a la derecha: 1 baldosa y media de ancho menos un 10 %, sin tocar el techo
  wood: { width: 1.5 * TILE * 0.9, height: 6.5, rightMargin: 0.8 },
}

/** Televisor de pantalla plana colgado en la parte izquierda de la pared (≈ 55"). */
export const TV = {
  width: 4.1,
  height: 2.35,
  centerX: -3.4,
  centerY: 4.4,
}

/** Cámara de vigilancia: en la pared, a medio camino entre el televisor y la puerta, cerca del techo. */
export const SECURITY_CAM = { y: 6.2 }
{
  const tvRight = TV.centerX + TV.width / 2
  const doorLeft = FLOOR_W / 2 - WALL.wood.rightMargin - WALL.wood.width
  SECURITY_CAM.x = (tvRight + doorLeft) / 2
}

/** Sofá sin respaldo, con brazos cuadrados y cubierto por una manta azul (ver foto de referencia). */
export const SOFA = {
  width: 6,
  depth: 3.6,
  armW: 0.9,
  plinthH: 0.12, // zócalo de madera
  baseH: 0.8, // cuerpo de tela beige
  cushionH: 0.4, // colchón del asiento
  armRise: 0.5, // cuánto sobresalen los brazos por encima del asiento
  position: [0, 0, 0], // se calcula abajo
}
// Pegado al borde izquierdo del piso y separado una baldosa de la pared del fondo
SOFA.position = [-FLOOR_W / 2 + SOFA.width / 2 + 0.3, 0, -FLOOR_D / 2 + TILE + SOFA.depth / 2]
SOFA.seatTop = SOFA.plinthH + SOFA.baseH + SOFA.cushionH // ≈ 1.32

/** Puntos del asiento (coordenadas locales del sofá) para colocar perritas y mantas. */
const SEAT_INNER = SOFA.width - 2 * SOFA.armW
export const seatSpots = {
  center: [0, SOFA.seatTop, 0],
  backLeft: [-SEAT_INNER / 2 + 1.05, SOFA.seatTop, -SOFA.depth / 2 + 1.15],
  backRight: [SEAT_INNER / 2 - 1.0, SOFA.seatTop, -SOFA.depth / 2 + 0.95],
}

/** Escalera de 4 escalones acolchados, frente al asiento y algo a la derecha. */
export const STAIRS = {
  steps: 4,
  width: 1.7,
  stepDepth: 0.55,
  offsetX: 0.7, // respecto al centro del sofá
}
export const SOFA_FRONT = SOFA.position[2] + SOFA.depth / 2
// Girada 90°: corre pegada al frente del sofá; el escalón alto está en STAIRS.position
// y los escalones bajan hacia -X (izquierda)
STAIRS.position = [SOFA.position[0] + STAIRS.offsetX, 0, SOFA_FRONT + STAIRS.width / 2 + 0.06]
STAIRS.rotationY = -Math.PI / 2

/** Bella acostada en el sofá: hacia dónde mira (su cuerpo se extiende a lo largo de esa dirección). */
export const BELLA = { yaw: 0.5, scale: 1.173 }
// Medidas de su cuerpo en la escena (el modelo mide 1.9 × 1.27 a escala 1)
BELLA.length = 1.9 * BELLA.scale
BELLA.width = 1.27 * BELLA.scale

/**
 * Gusano de peluche, del largo de Bella, a su derecha sobre el asiento.
 * `offset` es respecto al centro del sofá; `yaw` deja la cabeza mirando hacia el frente/cámara.
 */
export const CATERPILLAR = { offset: [1.25, 0.05], yaw: -Math.PI / 2 + 0.3 }
CATERPILLAR.length = BELLA.length * 1.15

/** Sasha: punto de partida en el piso, mirando hacia la cámara. */
export const SASHA = {
  start: [2, 0, 3],
  startYaw: 0.7,
  scale: 1.6, // su modelo viene más pequeño en proporción que el de Bella
}
