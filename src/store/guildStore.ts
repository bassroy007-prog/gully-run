import { create } from 'zustand';

export interface GuildMember {
  id: string;
  name: string;
  level: number;
  weeklyScore: number;
  heroId: string;
}

export interface Guild {
  id: string;
  name: string;
  tag: string;
  description: string;
  level: number;
  xp: number;
  members: GuildMember[];
  weeklyScore: number;
  rank: number;
}

interface GuildStore {
  guild: Guild | null;
  myWeeklyScore: number;
  guildPoints: number;
  joinGuild: (guild: Guild) => void;
  leaveGuild: () => void;
  addWeeklyScore: (score: number) => void;
  resetWeekly: () => void;
}

const MOCK_GUILD: Guild = {
  id: 'mumbai_kings',
  name: 'Mumbai Kings',
  tag: 'MBK',
  description: 'Apna Mumbai, Apna Game!',
  level: 7,
  xp: 3400,
  weeklyScore: 284500,
  rank: 42,
  members: [
    { id: '1', name: 'Ravi Boss', level: 34, weeklyScore: 45000, heroId: 'cricket' },
    { id: '2', name: 'Anita Speed', level: 28, weeklyScore: 38000, heroId: 'bollywood' },
    { id: '3', name: 'Suresh Run', level: 22, weeklyScore: 29000, heroId: 'tapori' },
    { id: '4', name: 'Priya Fast', level: 19, weeklyScore: 22000, heroId: 'hacker' },
    { id: '5', name: 'Ajay Gully', level: 15, weeklyScore: 18000, heroId: 'autoking' },
  ],
};

export const useGuildStore = create<GuildStore>((set, get) => ({
  guild: MOCK_GUILD,
  myWeeklyScore: 0,
  guildPoints: 120,

  joinGuild: (guild) => set({ guild }),

  leaveGuild: () => set({ guild: null }),

  addWeeklyScore: (score) => set((s) => ({
    myWeeklyScore: s.myWeeklyScore + score,
    guildPoints: s.guildPoints + Math.floor(score / 100),
  })),

  resetWeekly: () => set({ myWeeklyScore: 0 }),
}));
