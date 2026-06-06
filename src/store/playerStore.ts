import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MissionProgress {
  [missionId: string]: number;
}

export interface DailyReward {
  lastClaimedDay: number;
  streak: number;
}

export interface PlayerState {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  // Currencies
  coins: number;
  mumbaiBucks: number;        // renamed from gold — premium currency
  festivalTokens: number;
  // Stats
  highScore: number;
  totalRuns: number;
  totalCoinsEarned: number;
  totalDistance: number;
  totalJumps: number;
  totalPowerUpsUsed: number;
  // Hero & zone
  selectedHeroId: string;
  unlockedHeroIds: string[];
  unlockedZones: string[];
  // Progress
  achievements: string[];
  missionProgress: MissionProgress;
  completedMissions: string[];
  storyChapter: number;
  vipLevel: number;
  // Daily rewards
  dailyReward: DailyReward;
  lastActiveTime: number;

  // Actions
  setName: (name: string) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addMumbaiBucks: (amount: number) => void;
  spendMumbaiBucks: (amount: number) => boolean;
  addFestivalTokens: (amount: number) => void;
  addXP: (amount: number) => void;
  updateHighScore: (score: number) => void;
  setSelectedHero: (heroId: string) => void;
  unlockHero: (heroId: string) => void;
  incrementRuns: () => void;
  addDistance: (dist: number) => void;
  addJumps: (n: number) => void;
  addPowerUpUsed: () => void;
  unlockZone: (zoneId: string) => void;
  unlockAchievement: (id: string) => void;
  updateMissionProgress: (missionId: string, value: number) => void;
  completeMission: (missionId: string) => void;
  advanceStoryChapter: () => void;
  claimDailyReward: () => { coins: number; mumbaiBucks: number };
  saveState: () => Promise<void>;
  loadState: () => Promise<void>;
}

const XP_PER_LEVEL = (level: number) => Math.floor(100 * Math.pow(1.4, level - 1));

const DAILY_REWARD_TABLE = [
  { coins: 100, mumbaiBucks: 0 },
  { coins: 150, mumbaiBucks: 0 },
  { coins: 200, mumbaiBucks: 5 },
  { coins: 200, mumbaiBucks: 0 },
  { coins: 300, mumbaiBucks: 0 },
  { coins: 350, mumbaiBucks: 10 },
  { coins: 500, mumbaiBucks: 20 },
];

const DEFAULT_STATE = {
  name: 'Runner',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  coins: 500,
  mumbaiBucks: 50,
  festivalTokens: 0,
  highScore: 0,
  totalRuns: 0,
  totalCoinsEarned: 0,
  totalDistance: 0,
  totalJumps: 0,
  totalPowerUpsUsed: 0,
  selectedHeroId: 'delivery_boy',
  unlockedHeroIds: ['delivery_boy'],
  unlockedZones: ['gully'],
  achievements: [],
  missionProgress: {},
  completedMissions: [],
  storyChapter: 1,
  vipLevel: 0,
  dailyReward: { lastClaimedDay: 0, streak: 0 },
  lastActiveTime: Date.now(),
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  ...DEFAULT_STATE,

  setName: (name) => set({ name }),

  addCoins: (amount) => set((s) => ({
    coins: s.coins + amount,
    totalCoinsEarned: s.totalCoinsEarned + amount,
  })),

  spendCoins: (amount) => {
    if (get().coins < amount) return false;
    set((s) => ({ coins: s.coins - amount }));
    return true;
  },

  addMumbaiBucks: (amount) => set((s) => ({ mumbaiBucks: s.mumbaiBucks + amount })),

  spendMumbaiBucks: (amount) => {
    if (get().mumbaiBucks < amount) return false;
    set((s) => ({ mumbaiBucks: s.mumbaiBucks - amount }));
    return true;
  },

  addFestivalTokens: (amount) => set((s) => ({ festivalTokens: s.festivalTokens + amount })),

  addXP: (amount) => set((s) => {
    let xp = s.xp + amount;
    let level = s.level;
    let xpToNext = s.xpToNextLevel;
    while (xp >= xpToNext) {
      xp -= xpToNext;
      level++;
      xpToNext = XP_PER_LEVEL(level);
    }
    return { xp, level, xpToNextLevel: xpToNext };
  }),

  updateHighScore: (score) => set((s) => ({
    highScore: Math.max(s.highScore, score),
  })),

  setSelectedHero: (heroId) => set({ selectedHeroId: heroId }),

  unlockHero: (heroId) => set((s) => ({
    unlockedHeroIds: s.unlockedHeroIds.includes(heroId)
      ? s.unlockedHeroIds
      : [...s.unlockedHeroIds, heroId],
  })),

  incrementRuns: () => set((s) => ({ totalRuns: s.totalRuns + 1 })),
  addDistance: (dist) => set((s) => ({ totalDistance: s.totalDistance + dist })),
  addJumps: (n) => set((s) => ({ totalJumps: s.totalJumps + n })),
  addPowerUpUsed: () => set((s) => ({ totalPowerUpsUsed: s.totalPowerUpsUsed + 1 })),

  unlockZone: (zoneId) => set((s) => ({
    unlockedZones: s.unlockedZones.includes(zoneId)
      ? s.unlockedZones
      : [...s.unlockedZones, zoneId],
  })),

  unlockAchievement: (id) => set((s) => ({
    achievements: s.achievements.includes(id) ? s.achievements : [...s.achievements, id],
  })),

  updateMissionProgress: (missionId, value) => set((s) => ({
    missionProgress: {
      ...s.missionProgress,
      [missionId]: (s.missionProgress[missionId] ?? 0) + value,
    },
  })),

  completeMission: (missionId) => set((s) => ({
    completedMissions: s.completedMissions.includes(missionId)
      ? s.completedMissions
      : [...s.completedMissions, missionId],
  })),

  advanceStoryChapter: () => set((s) => ({ storyChapter: Math.min(s.storyChapter + 1, 8) })),

  claimDailyReward: () => {
    const today = Math.floor(Date.now() / 86400000);
    const { dailyReward } = get();
    if (dailyReward.lastClaimedDay === today) return { coins: 0, mumbaiBucks: 0 };

    const streak = dailyReward.lastClaimedDay === today - 1
      ? Math.min(dailyReward.streak + 1, 7)
      : 1;
    const reward = DAILY_REWARD_TABLE[(streak - 1) % 7];

    set({
      dailyReward: { lastClaimedDay: today, streak },
      coins: get().coins + reward.coins,
      mumbaiBucks: get().mumbaiBucks + reward.mumbaiBucks,
    });
    return reward;
  },

  saveState: async () => {
    try {
      const s = get();
      await AsyncStorage.setItem('player_state_v2', JSON.stringify({
        name: s.name, level: s.level, xp: s.xp,
        coins: s.coins, mumbaiBucks: s.mumbaiBucks, festivalTokens: s.festivalTokens,
        highScore: s.highScore, totalRuns: s.totalRuns, totalCoinsEarned: s.totalCoinsEarned,
        totalDistance: s.totalDistance, totalJumps: s.totalJumps, totalPowerUpsUsed: s.totalPowerUpsUsed,
        selectedHeroId: s.selectedHeroId, unlockedHeroIds: s.unlockedHeroIds,
        unlockedZones: s.unlockedZones, achievements: s.achievements,
        missionProgress: s.missionProgress, completedMissions: s.completedMissions,
        storyChapter: s.storyChapter, vipLevel: s.vipLevel,
        dailyReward: s.dailyReward, lastActiveTime: Date.now(),
      }));
    } catch {}
  },

  loadState: async () => {
    try {
      const raw = await AsyncStorage.getItem('player_state_v2');
      if (raw) {
        const data = JSON.parse(raw);
        set({ ...DEFAULT_STATE, ...data, xpToNextLevel: XP_PER_LEVEL(data.level || 1) });
      }
    } catch {}
  },
}));
