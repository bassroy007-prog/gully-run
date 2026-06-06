import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BUILDINGS, getBuildingIncome, getBuildingUpgradeCost } from '../constants/buildings';

export interface OwnedBuilding {
  buildingId: string;
  level: number;
  lastCollectedAt: number;
}

interface CityStore {
  buildings: Record<string, OwnedBuilding>;
  purchaseBuilding: (buildingId: string, spendCoins: (n: number) => boolean) => boolean;
  upgradeBuilding: (buildingId: string, spendCoins: (n: number) => boolean) => boolean;
  collectIncome: (buildingId: string) => number;
  collectAllIncome: () => number;
  getPendingIncome: (buildingId: string) => number;
  getTotalPendingIncome: () => number;
  saveState: () => Promise<void>;
  loadState: () => Promise<void>;
}

const DEFAULT_BUILDINGS: Record<string, OwnedBuilding> = {
  chawl: { buildingId: 'chawl', level: 1, lastCollectedAt: Date.now() },
};

export const useCityStore = create<CityStore>((set, get) => ({
  buildings: DEFAULT_BUILDINGS,

  purchaseBuilding: (buildingId, spendCoins) => {
    const building = BUILDINGS.find(b => b.id === buildingId);
    if (!building) return false;
    if (get().buildings[buildingId]) return false;
    if (!spendCoins(building.baseCost)) return false;
    set((s) => ({
      buildings: {
        ...s.buildings,
        [buildingId]: { buildingId, level: 1, lastCollectedAt: Date.now() },
      },
    }));
    return true;
  },

  upgradeBuilding: (buildingId, spendCoins) => {
    const building = BUILDINGS.find(b => b.id === buildingId);
    const owned = get().buildings[buildingId];
    if (!building || !owned) return false;
    if (owned.level >= building.maxLevel) return false;
    const cost = getBuildingUpgradeCost(building, owned.level);
    if (!spendCoins(cost)) return false;
    set((s) => ({
      buildings: {
        ...s.buildings,
        [buildingId]: { ...owned, level: owned.level + 1 },
      },
    }));
    return true;
  },

  collectIncome: (buildingId) => {
    const amount = get().getPendingIncome(buildingId);
    if (amount <= 0) return 0;
    set((s) => ({
      buildings: {
        ...s.buildings,
        [buildingId]: { ...s.buildings[buildingId], lastCollectedAt: Date.now() },
      },
    }));
    return amount;
  },

  collectAllIncome: () => {
    const { buildings } = get();
    let total = 0;
    const updated = { ...buildings };
    const now = Date.now();
    for (const id of Object.keys(buildings)) {
      total += get().getPendingIncome(id);
      updated[id] = { ...updated[id], lastCollectedAt: now };
    }
    set({ buildings: updated });
    return total;
  },

  getPendingIncome: (buildingId) => {
    const building = BUILDINGS.find(b => b.id === buildingId);
    const owned = get().buildings[buildingId];
    if (!building || !owned) return 0;
    const hoursElapsed = (Date.now() - owned.lastCollectedAt) / 3600000;
    const income = getBuildingIncome(building, owned.level);
    return Math.floor(Math.min(hoursElapsed, 12) * income);
  },

  getTotalPendingIncome: () =>
    Object.keys(get().buildings).reduce((sum, id) => sum + get().getPendingIncome(id), 0),

  saveState: async () => {
    try {
      await AsyncStorage.setItem('city_state', JSON.stringify(get().buildings));
    } catch {}
  },

  loadState: async () => {
    try {
      const raw = await AsyncStorage.getItem('city_state');
      if (raw) set({ buildings: { ...DEFAULT_BUILDINGS, ...JSON.parse(raw) } });
    } catch {}
  },
}));
