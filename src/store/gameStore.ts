import { create } from 'zustand';

export type GameStatus = 'idle' | 'running' | 'paused' | 'dead';

// Mumbai-themed power-up names
export type PowerUp =
  | 'auto_rickshaw_boost'   // Ramesh's auto turbo
  | 'vada_pav_magnet'       // coin magnet
  | 'bollywood_star'        // GULLY Headphones — invincibility
  | 'local_train_turbo'     // Neon train — speed boost
  | 'ganesh_blessing'       // Glowing Modak — shield
  | 'monsoon_glide'         // GULLY KING sneakers — monsoon surf
  | 'roof_hop'              // ROOF HOP Golden Shoe — super jump
  | 'campus_boost'          // Rocket backpack — campus parkour
  | 'dhol_slow'             // Dhol drum — slow-mo obstacles
  | 'monsoon_boost'         // Water tornado — speed + immunity
  | 'movie_magic'           // Clapperboard — 3x score multiplier
  | 'nitro_booster'         // Nitro — ultra speed burst
  | 'dabbawalla_rush'       // Dabbawalla harness — magnet + auto-dodge
  | 'shopping_rush'         // Gold bag — instant 500 coins
  | 'tiffin_tower'          // Power tiffin — speed + shield + magnet
  | null;

export type Lane = 0 | 1 | 2;

interface GameStore {
  status: GameStatus;
  score: number;
  distance: number;
  coinsCollected: number;
  jumpsThisRun: number;
  powerUpsUsedThisRun: number;
  currentLane: Lane;
  speed: number;
  combo: number;
  activePowerUp: PowerUp;
  powerUpTimeLeft: number;
  isJumping: boolean;
  isSliding: boolean;
  zone: string;
  shielded: boolean;
  runStartTime: number;
  nearMissCount: number;

  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  addScore: (points: number) => void;
  addCoin: (multiplier?: number) => void;
  setLane: (lane: Lane) => void;
  setSpeed: (speed: number) => void;
  setJumping: (v: boolean) => void;
  setSliding: (v: boolean) => void;
  activatePowerUp: (powerUp: NonNullable<PowerUp>, duration: number) => void;
  deactivatePowerUp: () => void;
  tickPowerUp: (delta: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  setZone: (zone: string) => void;
  addDistance: (d: number) => void;
  registerJump: () => void;
  registerNearMiss: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  status: 'idle',
  score: 0,
  distance: 0,
  coinsCollected: 0,
  jumpsThisRun: 0,
  powerUpsUsedThisRun: 0,
  currentLane: 1,
  speed: 6,
  combo: 0,
  activePowerUp: null,
  powerUpTimeLeft: 0,
  isJumping: false,
  isSliding: false,
  zone: 'gully',
  shielded: false,
  runStartTime: 0,
  nearMissCount: 0,

  startGame: () => set({
    status: 'running',
    score: 0,
    distance: 0,
    coinsCollected: 0,
    jumpsThisRun: 0,
    powerUpsUsedThisRun: 0,
    currentLane: 1,
    speed: 6,
    combo: 0,
    activePowerUp: null,
    powerUpTimeLeft: 0,
    isJumping: false,
    isSliding: false,
    shielded: false,
    runStartTime: Date.now(),
    nearMissCount: 0,
  }),

  pauseGame: () => set({ status: 'paused' }),
  resumeGame: () => set({ status: 'running' }),
  endGame: () => set({ status: 'dead' }),

  addScore: (points) => set((s) => ({
    score: s.score + points * (1 + s.combo * 0.1),
  })),

  addCoin: (multiplier = 1) => set((s) => {
    const isTurbo = s.activePowerUp === 'local_train_turbo';
    const isMovieMagic = s.activePowerUp === 'movie_magic';
    const val = multiplier * (isTurbo ? 3 : isMovieMagic ? 3 : 1);
    return {
      coinsCollected: s.coinsCollected + val,
      score: s.score + val,
    };
  }),

  setLane: (lane) => set({ currentLane: lane }),
  setSpeed: (speed) => set({ speed }),
  setJumping: (v) => set({ isJumping: v }),
  setSliding: (v) => set({ isSliding: v }),

  activatePowerUp: (powerUp, duration) => set((s) => ({
    activePowerUp: powerUp,
    powerUpTimeLeft: duration,
    shielded: powerUp === 'ganesh_blessing' ? true : s.shielded,
    powerUpsUsedThisRun: s.powerUpsUsedThisRun + 1,
  })),

  deactivatePowerUp: () => set((s) => ({
    activePowerUp: null,
    powerUpTimeLeft: 0,
    shielded: s.activePowerUp === 'ganesh_blessing' ? false : s.shielded,
  })),

  tickPowerUp: (delta) => {
    const { powerUpTimeLeft, activePowerUp } = get();
    if (!activePowerUp || activePowerUp === 'ganesh_blessing') return;
    const remaining = powerUpTimeLeft - delta;
    if (remaining <= 0) get().deactivatePowerUp();
    else set({ powerUpTimeLeft: remaining });
  },

  incrementCombo: () => set((s) => ({ combo: s.combo + 1 })),
  resetCombo: () => set({ combo: 0 }),
  setZone: (zone) => set({ zone }),
  addDistance: (d) => set((s) => ({ distance: s.distance + d })),
  registerJump: () => set((s) => ({ jumpsThisRun: s.jumpsThisRun + 1 })),
  registerNearMiss: () => set((s) => ({
    nearMissCount: s.nearMissCount + 1,
    score: s.score + 25,
  })),
}));
