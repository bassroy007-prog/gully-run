import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const SCREEN = { W: SCREEN_W, H: SCREEN_H };

export const LANES = {
  count: 3,
  width: SCREEN_W / 3,
  positions: [SCREEN_W / 6, SCREEN_W / 2, (SCREEN_W * 5) / 6],
};

export const PLAYER = {
  width: 48,
  height: 72,
  groundY: SCREEN_H * 0.72,
  jumpForce: -22,
  gravity: 0.9,
  slideHeight: 36,
  slideDuration: 600,
};

export const GAME = {
  baseSpeed: 6,
  maxSpeed: 22,
  speedIncrement: 0.0018,
  targetFPS: 60,
  groundHeight: 80,
  skyHeight: SCREEN_H * 0.28,
};

export const SPAWN = {
  minObstacleGap: 220,
  maxObstacleGap: 520,
  collectibleChance: 0.40,
  powerUpChance: 0.07,
};

export const POWERUP_DURATIONS: Record<string, number> = {
  vada_pav_magnet:      12000,
  bollywood_star:       8000,
  local_train_turbo:    6000,
  ganesh_blessing:      0,       // shield — duration-less, hit-based
  monsoon_glide:        10000,
  auto_rickshaw_boost:  8000,
  roof_hop:             8000,
  campus_boost:         8000,
  // New power-ups
  dhol_slow:            8000,
  monsoon_boost:        7000,
  movie_magic:          10000,
  nitro_booster:        5000,
  dabbawalla_rush:      12000,
  shopping_rush:        0,       // instant — no duration
  tiffin_tower:         9000,
};

export const SCORE = {
  coinValue: 1,
  distanceMultiplier: 0.1,
  comboMultiplier: 0.5,
  nearMissBonus: 25,
};

// 7 total zones — 3 launch, 4 unlocked by score
export const ZONES = [
  {
    id: 'gully',
    name: 'Mumbai Gully Streets',
    description: 'Colorful houses, street vendors, rickshaws, local markets',
    emoji: '🏘️',
    unlockScore: 0,
    unlockLabel: 'Starter Zone',
    skyColor: '#1A0A05',
    groundColor: '#3E2723',
    buildingColor: '#5D4037',
    accentColor: '#FF6B35',
    isLaunch: true,
  },
  {
    id: 'marine_drive',
    name: 'Marine Drive',
    description: 'Ocean view, palm trees, stunning sunset atmosphere',
    emoji: '🌊',
    unlockScore: 8000,
    unlockLabel: 'Score 8,000',
    skyColor: '#0A1A2A',
    groundColor: '#1A2A3A',
    buildingColor: '#1565C0',
    accentColor: '#00B4D8',
    isLaunch: true,
  },
  {
    id: 'local_train',
    name: 'Local Train Rooftops',
    description: 'Fast-paced action — jump between Mumbai local trains',
    emoji: '🚂',
    unlockScore: 20000,
    unlockLabel: 'Score 20,000',
    skyColor: '#0F0F1A',
    groundColor: '#1A1A2A',
    buildingColor: '#37474F',
    accentColor: '#FFD700',
    isLaunch: true,
  },
  {
    id: 'bollywood',
    name: 'Bollywood Studios',
    description: 'Film sets, dance stages, bright lights, celebrity encounters',
    emoji: '🎬',
    unlockScore: 50000,
    unlockLabel: 'Score 50,000',
    skyColor: '#1A0A1A',
    groundColor: '#2A0A2A',
    buildingColor: '#880E4F',
    accentColor: '#E91E63',
    isLaunch: false,
  },
  {
    id: 'monsoon',
    name: 'Monsoon Mumbai',
    description: 'Rain effects, water splashes, flooded roads, lightning',
    emoji: '🌧️',
    unlockScore: 100000,
    unlockLabel: 'Score 100,000',
    skyColor: '#0A0A1A',
    groundColor: '#0A1A2A',
    buildingColor: '#1A2A3A',
    accentColor: '#00BCD4',
    isLaunch: false,
  },
  {
    id: 'festival',
    name: 'Ganesh Festival',
    description: 'Decorative lights, celebration atmosphere, festival music',
    emoji: '🐘',
    unlockScore: 0,
    unlockLabel: 'Seasonal Event',
    skyColor: '#1A0A00',
    groundColor: '#2A1A00',
    buildingColor: '#E65100',
    accentColor: '#FF8F00',
    isLaunch: false,
  },
  {
    id: 'night_mumbai',
    name: 'Night Mumbai',
    description: 'Neon signs, food stalls, dynamic city lighting',
    emoji: '🌃',
    unlockScore: 200000,
    unlockLabel: 'Score 200,000',
    skyColor: '#000510',
    groundColor: '#0A0A1A',
    buildingColor: '#1A0A2A',
    accentColor: '#9C27B0',
    isLaunch: false,
  },
] as const;

export type ZoneId = typeof ZONES[number]['id'];

export const getZoneById = (id: ZoneId) => ZONES.find(z => z.id === id);
