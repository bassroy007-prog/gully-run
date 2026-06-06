import { SCREEN } from '../../constants/gameConfig';

export type ObstacleType =
  // === ORIGINAL ===
  | 'rickshaw'
  | 'bus'
  | 'street_dog'
  | 'fruit_cart'
  | 'construction'
  | 'train'
  | 'water_puddle'
  | 'barricade'
  | 'festival_crowd'
  | 'pothole'
  | 'speed_breaker'
  | 'traffic_police'
  // === NEW MUMBAI OBSTACLES ===
  | 'taxi'           // black-yellow kaali peeli — jump or lane change
  | 'holy_cow'       // sacred cow blocking road — jump over
  | 'laundry_line'   // hanging clothes across gully — slide under
  | 'electric_wires' // sparking low wires — slide under
  | 'fire_hydrant'   // water puddle + hydrant — jump or lane change
  | 'police_van'     // Mumbai Police Force van — wide, lane change only
  | 'manhole'        // open manhole — jump over
  | 'crowd'          // pedestrian crowd — wide, lane change
  | 'cycle'          // cycle wala with food baskets — jump or lane change
  | 'kirana_stall'   // roadside kirana shop — lane change
  | 'fruit_basket';  // spilled fruit basket — jump over

export interface Obstacle {
  id: string;
  type: ObstacleType;
  lane: number;
  x: number;
  y: number;
  width: number;
  height: number;
  canJump: boolean;
  canSlide: boolean;
  canLaneChange: boolean;
  isWide: boolean;   // true = spans 2 lanes
  emoji: string;
  color: string;
}

const OBSTACLE_CONFIG: Record<ObstacleType, Omit<Obstacle, 'id' | 'lane' | 'x' | 'y'>> = {
  rickshaw:       { type: 'rickshaw', width: 64, height: 56, canJump: true, canSlide: false, canLaneChange: true, isWide: false, emoji: '🛺', color: '#FFD700' },
  bus:            { type: 'bus', width: 80, height: 84, canJump: false, canSlide: true, canLaneChange: true, isWide: false, emoji: '🚌', color: '#E53935' },
  street_dog:     { type: 'street_dog', width: 44, height: 36, canJump: true, canSlide: false, canLaneChange: true, isWide: false, emoji: '🐕', color: '#8D6E63' },
  fruit_cart:     { type: 'fruit_cart', width: 56, height: 52, canJump: true, canSlide: false, canLaneChange: true, isWide: false, emoji: '🛒', color: '#FF8F00' },
  construction:   { type: 'construction', width: 72, height: 60, canJump: false, canSlide: true, canLaneChange: true, isWide: false, emoji: '🚧', color: '#FF8F00' },
  train:          { type: 'train', width: 90, height: 72, canJump: false, canSlide: false, canLaneChange: true, isWide: true,  emoji: '🚂', color: '#37474F' },
  water_puddle:   { type: 'water_puddle', width: 80, height: 18, canJump: true, canSlide: false, canLaneChange: true, isWide: false, emoji: '💧', color: '#1E88E5' },
  barricade:      { type: 'barricade', width: 56, height: 50, canJump: false, canSlide: true, canLaneChange: true, isWide: false, emoji: '🚫', color: '#EF5350' },
  festival_crowd: { type: 'festival_crowd', width: 70, height: 80, canJump: false, canSlide: false, canLaneChange: true, isWide: true,  emoji: '👥', color: '#E91E63' },
  pothole:        { type: 'pothole', width: 52, height: 22, canJump: true, canSlide: false, canLaneChange: true, isWide: false, emoji: '🕳️', color: '#424242' },
  speed_breaker:  { type: 'speed_breaker', width: 90, height: 24, canJump: true, canSlide: false, canLaneChange: false, isWide: true,  emoji: '〰️', color: '#FFEB3B' },
  traffic_police: { type: 'traffic_police', width: 44, height: 72, canJump: false, canSlide: false, canLaneChange: true, isWide: false, emoji: '👮', color: '#283593' },
  // === NEW ===
  taxi:           { type: 'taxi',           width: 68, height: 52, canJump: true,  canSlide: false, canLaneChange: true,  isWide: false, emoji: '🚕', color: '#FFD600' },
  holy_cow:       { type: 'holy_cow',       width: 60, height: 64, canJump: true,  canSlide: false, canLaneChange: true,  isWide: false, emoji: '🐄', color: '#ECEFF1' },
  laundry_line:   { type: 'laundry_line',   width: 90, height: 30, canJump: false, canSlide: true,  canLaneChange: false, isWide: true,  emoji: '👗', color: '#E91E63' },
  electric_wires: { type: 'electric_wires', width: 90, height: 28, canJump: false, canSlide: true,  canLaneChange: false, isWide: true,  emoji: '⚡', color: '#37474F' },
  fire_hydrant:   { type: 'fire_hydrant',   width: 52, height: 50, canJump: true,  canSlide: false, canLaneChange: true,  isWide: false, emoji: '🚒', color: '#F44336' },
  police_van:     { type: 'police_van',     width: 84, height: 68, canJump: false, canSlide: false, canLaneChange: true,  isWide: true,  emoji: '🚔', color: '#1565C0' },
  manhole:        { type: 'manhole',        width: 54, height: 20, canJump: true,  canSlide: false, canLaneChange: true,  isWide: false, emoji: '🕳️', color: '#424242' },
  crowd:          { type: 'crowd',          width: 76, height: 76, canJump: false, canSlide: false, canLaneChange: true,  isWide: true,  emoji: '👥', color: '#FF7043' },
  cycle:          { type: 'cycle',          width: 56, height: 52, canJump: true,  canSlide: false, canLaneChange: true,  isWide: false, emoji: '🚲', color: '#FF8F00' },
  kirana_stall:   { type: 'kirana_stall',   width: 72, height: 80, canJump: false, canSlide: false, canLaneChange: true,  isWide: false, emoji: '🏪', color: '#8D6E63' },
  fruit_basket:   { type: 'fruit_basket',   width: 50, height: 36, canJump: true,  canSlide: false, canLaneChange: true,  isWide: false, emoji: '🧺', color: '#FF6F00' },
};

let nextId = 0;

export const createObstacle = (type: ObstacleType, lane: number, groundY: number): Obstacle => {
  const config = OBSTACLE_CONFIG[type];
  return {
    ...config,
    id: `obs_${nextId++}`,
    lane,
    x: SCREEN.W + config.width,
    y: groundY - config.height,
  };
};

// Common obstacles — early game, gully zone
export const COMMON_OBSTACLES: ObstacleType[] = [
  'rickshaw', 'bus', 'street_dog', 'fruit_cart', 'water_puddle', 'barricade', 'pothole',
  'taxi', 'holy_cow', 'cycle', 'fruit_basket', 'manhole',
];
// Advanced obstacles — higher speeds, all zones
export const ADVANCED_OBSTACLES: ObstacleType[] = [
  ...COMMON_OBSTACLES,
  'construction', 'festival_crowd', 'speed_breaker', 'traffic_police',
  'laundry_line', 'electric_wires', 'fire_hydrant', 'police_van', 'crowd', 'kirana_stall',
];
// Train zone specific
export const TRAIN_OBSTACLES: ObstacleType[] = ['train', 'barricade', 'speed_breaker', 'construction', 'electric_wires'];
// Gully zone — narrow streets, slide obstacles prominent
export const GULLY_OBSTACLES: ObstacleType[] = [
  'rickshaw', 'street_dog', 'fruit_cart', 'pothole', 'taxi', 'holy_cow',
  'laundry_line', 'electric_wires', 'cycle', 'kirana_stall', 'fruit_basket', 'manhole',
];
// Monsoon zone — water and flood hazards
export const MONSOON_OBSTACLES: ObstacleType[] = [
  'water_puddle', 'pothole', 'manhole', 'barricade', 'fire_hydrant', 'bus', 'taxi', 'police_van',
];
// Festival zone — crowds and celebration hazards
export const FESTIVAL_OBSTACLES: ObstacleType[] = [
  'festival_crowd', 'crowd', 'barricade', 'holy_cow', 'rickshaw', 'cycle',
];
