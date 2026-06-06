import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HeroLevel {
  heroId: string;
  level: number;
}

interface HeroStore {
  heroLevels: Record<string, number>;
  upgradeHero: (heroId: string) => void;
  getHeroLevel: (heroId: string) => number;
  saveState: () => Promise<void>;
  loadState: () => Promise<void>;
}

export const useHeroStore = create<HeroStore>((set, get) => ({
  heroLevels: { delivery_boy: 1 },

  upgradeHero: (heroId) => set((s) => ({
    heroLevels: { ...s.heroLevels, [heroId]: (s.heroLevels[heroId] ?? 1) + 1 },
  })),

  getHeroLevel: (heroId) => get().heroLevels[heroId] ?? 1,

  saveState: async () => {
    try {
      await AsyncStorage.setItem('hero_levels', JSON.stringify(get().heroLevels));
    } catch {}
  },

  loadState: async () => {
    try {
      const raw = await AsyncStorage.getItem('hero_levels');
      if (raw) set({ heroLevels: { delivery_boy: 1, ...JSON.parse(raw) } });
    } catch {}
  },
}));
