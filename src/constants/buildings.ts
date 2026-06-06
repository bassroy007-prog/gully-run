export interface Building {
  id: string;
  name: string;
  emoji: string;
  description: string;
  baseCost: number;
  baseIncome: number;
  maxLevel: number;
  incomePerLevel: number;
  unlockLevel: number;
  bgColor: string;
}

export const BUILDINGS: Building[] = [
  {
    id: 'chawl',
    name: 'Chawl Room',
    emoji: '🏠',
    description: 'Your humble beginning. A chawl room in the gully.',
    baseCost: 0,
    baseIncome: 5,
    maxLevel: 10,
    incomePerLevel: 5,
    unlockLevel: 1,
    bgColor: '#8B4513',
  },
  {
    id: 'vadapav_stall',
    name: 'Vada Pav Stall',
    emoji: '🍔',
    description: 'Mumbai\'s favourite street food. Always a crowd.',
    baseCost: 500,
    baseIncome: 10,
    maxLevel: 10,
    incomePerLevel: 10,
    unlockLevel: 2,
    bgColor: '#FF6B35',
  },
  {
    id: 'chai_shop',
    name: 'Cutting Chai Shop',
    emoji: '☕',
    description: 'Cutting chai: the fuel of Mumbai. Open 24/7.',
    baseCost: 1500,
    baseIncome: 20,
    maxLevel: 10,
    incomePerLevel: 20,
    unlockLevel: 5,
    bgColor: '#795548',
  },
  {
    id: 'auto_stand',
    name: 'Autorickshaw Stand',
    emoji: '🛺',
    description: 'Run a fleet of autos. The streets are your business.',
    baseCost: 5000,
    baseIncome: 50,
    maxLevel: 10,
    incomePerLevel: 50,
    unlockLevel: 10,
    bgColor: '#FFD700',
  },
  {
    id: 'cricket_maidan',
    name: 'Cricket Maidan',
    emoji: '🏏',
    description: 'Host local cricket tournaments. Everyone pays to watch.',
    baseCost: 20000,
    baseIncome: 100,
    maxLevel: 10,
    incomePerLevel: 100,
    unlockLevel: 20,
    bgColor: '#4CAF50',
  },
  {
    id: 'bollywood_studio',
    name: 'Bollywood Studio',
    emoji: '🎬',
    description: 'Your own film studio. Blockbusters every season.',
    baseCost: 100000,
    baseIncome: 250,
    maxLevel: 10,
    incomePerLevel: 250,
    unlockLevel: 35,
    bgColor: '#E91E63',
  },
];

export const getBuildingById = (id: string) => BUILDINGS.find(b => b.id === id);

export const getBuildingUpgradeCost = (building: Building, currentLevel: number) =>
  Math.floor(building.baseCost * Math.pow(1.8, currentLevel));

export const getBuildingIncome = (building: Building, level: number) =>
  building.baseIncome + building.incomePerLevel * (level - 1);
