import { SCREEN, PLAYER } from '../../constants/gameConfig';

export type CollectibleType =
  // === COINS / CURRENCY ===
  | 'coin'
  | 'cash'              // ₹500 notes bundle — premium coin burst
  | 'local_pass'        // Mumbai dabba pass — 3D silver tiffin + orbital rings
  // === MUMBAI STREET FOOD (ground collectibles) ===
  | 'vada_pav'          // Vada Pav + Chai fire ring combo
  | 'chai'              // Golden cutting chai (solo, glowing)
  | 'poha'              // Poha — yellow flattened rice, lemon, cilantro
  | 'samosa'            // Chai + Samosa combo plate
  | 'upma'              // Upma — white semolina, curry leaves
  // === CORE POWER-UPS (floating, above ground) ===
  | 'auto_rickshaw_boost'
  | 'vada_pav_magnet'
  | 'bollywood_star'
  | 'local_train_turbo'
  | 'ganesh_blessing'
  | 'monsoon_glide'
  | 'roof_hop'
  | 'campus_boost'
  // === NEW POWER-UPS ===
  | 'dhol_slow'         // Dhol drum — slow-mo obstacles
  | 'monsoon_boost'     // Water tornado — speed + immunity
  | 'movie_magic'       // Bollywood clapperboard — 3x score
  | 'nitro_booster'     // Nitro — ultra speed burst
  | 'dabbawalla_rush'   // Dabbawalla harness — magnet + auto-dodge
  | 'shopping_rush'     // Gold shopping bag — instant 500 coins
  | 'tiffin_tower';     // Power-up tiffin — speed + shield + magnet

export interface Collectible {
  id: string;
  type: CollectibleType;
  lane: number;
  x: number;
  y: number;
  radius: number;
  value: number;
  emoji: string;
  color: string;
  collected: boolean;
}

const COLLECTIBLE_CONFIG: Record<CollectibleType, {
  radius: number; value: number; emoji: string; color: string;
}> = {
  // === COINS ===
  coin:       { radius: 14, value: 1,  emoji: '🪙', color: '#FFD700' },
  local_pass: { radius: 20, value: 10, emoji: '🍱', color: '#00B4D8' }, // silver dabba orbital — blue

  // === MUMBAI BREAKFAST COLLECTIBLES (orange energy swirl style) ===
  vada_pav: { radius: 20, value: 5,  emoji: '🍔', color: '#FF8C00' }, // Vada Pav+Chai fire ring — deep orange
  chai:     { radius: 16, value: 3,  emoji: '☕', color: '#F5A623' }, // Golden chai glow — warm amber
  poha:     { radius: 18, value: 4,  emoji: '🍛', color: '#F5C518' }, // Poha — turmeric yellow, golden swirl
  samosa:   { radius: 18, value: 7,  emoji: '🥟', color: '#D4651A' }, // Chai+Samosa — warm brown-orange
  upma:     { radius: 18, value: 6,  emoji: '🍚', color: '#C8B89A' }, // Upma — creamy beige with orange ring

  // === COINS / CASH ===
  cash: { radius: 22, value: 50, emoji: '💵', color: '#4CAF50' }, // ₹500 bundle — premium

  // === POWER-UPS (all floating above ground) ===
  auto_rickshaw_boost: { radius: 22, value: 0, emoji: '🔧', color: '#FF8C00' },
  vada_pav_magnet:     { radius: 22, value: 0, emoji: '⚡', color: '#F5A623' },
  bollywood_star:      { radius: 22, value: 0, emoji: '🎧', color: '#FF6D00' },
  local_train_turbo:   { radius: 22, value: 0, emoji: '🚆', color: '#C8FF00' },
  ganesh_blessing:     { radius: 22, value: 0, emoji: '🫓', color: '#FFD700' },
  monsoon_glide:       { radius: 22, value: 0, emoji: '👟', color: '#FF4500' },
  roof_hop:            { radius: 22, value: 0, emoji: '👟', color: '#F5C518' },
  campus_boost:        { radius: 22, value: 0, emoji: '🎒', color: '#00B4D8' },
  // New power-ups
  dhol_slow:           { radius: 22, value: 0, emoji: '🥁', color: '#FF8F00' },
  monsoon_boost:       { radius: 22, value: 0, emoji: '🌀', color: '#00BCD4' },
  movie_magic:         { radius: 22, value: 0, emoji: '🎬', color: '#FFD700' },
  nitro_booster:       { radius: 22, value: 0, emoji: '⚡', color: '#FF4500' },
  dabbawalla_rush:     { radius: 22, value: 0, emoji: '📦', color: '#4CAF50' },
  shopping_rush:       { radius: 22, value: 0, emoji: '🛍️', color: '#9C27B0' },
  tiffin_tower:        { radius: 22, value: 0, emoji: '🍱', color: '#00E676' },
};

let nextId = 0;

export const createCollectible = (type: CollectibleType, lane: number, groundY: number): Collectible => {
  const config = COLLECTIBLE_CONFIG[type];
  const flying = isPowerUp(type);
  return {
    ...config,
    id: `col_${nextId++}`,
    type,
    lane,
    x: SCREEN.W + config.radius,
    y: flying
      ? groundY - PLAYER.height - 40
      : groundY - config.radius - 10,
    collected: false,
  };
};

export const isPowerUp = (type: CollectibleType): boolean =>
  ['auto_rickshaw_boost', 'vada_pav_magnet', 'bollywood_star', 'local_train_turbo',
   'ganesh_blessing', 'monsoon_glide', 'roof_hop', 'campus_boost',
   'dhol_slow', 'monsoon_boost', 'movie_magic', 'nitro_booster',
   'dabbawalla_rush', 'shopping_rush', 'tiffin_tower'].includes(type);

export const POWER_UP_TYPES: CollectibleType[] = [
  'auto_rickshaw_boost', 'vada_pav_magnet', 'bollywood_star',
  'local_train_turbo',   'ganesh_blessing',  'monsoon_glide', 'roof_hop',
  'campus_boost',        'dhol_slow',        'monsoon_boost',
  'movie_magic',         'nitro_booster',    'dabbawalla_rush',
  'shopping_rush',       'tiffin_tower',
];

// Food collectibles — weighted spawn pool
// coin appears 3x (most common), breakfast items mixed in, local_pass rare, cash very rare
export const COIN_TYPES: CollectibleType[] = [
  'coin', 'coin', 'coin',           // most common
  'chai',                           // common — golden chai
  'poha',                           // common — morning breakfast
  'samosa',                         // medium — chai+samosa combo
  'vada_pav',                       // medium — iconic street food
  'upma',                           // medium — South Mumbai breakfast
  'local_pass',                     // rare — high value tiffin dabba
  'cash',                           // very rare — ₹500 bundle premium burst
];
