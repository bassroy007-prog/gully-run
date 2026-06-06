export type MissionType = 'daily' | 'weekly' | 'hero' | 'story';
export type MissionStat = 'runs' | 'coins' | 'distance' | 'jumps' | 'powerups' | 'score' | 'deliveries' | 'passengers';

export interface Mission {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  emoji: string;
  heroId?: string;
  stat: MissionStat;
  target: number;
  rewardCoins: number;
  rewardMumbaiBucks: number;
  rewardXP: number;
}

export const DAILY_MISSIONS: Mission[] = [
  { id: 'd1', type: 'daily', title: 'Early Riser', description: 'Complete 3 runs today', emoji: '🏃', stat: 'runs', target: 3, rewardCoins: 200, rewardMumbaiBucks: 0, rewardXP: 50 },
  { id: 'd2', type: 'daily', title: 'Coin Collector', description: 'Collect 500 coins in a single run', emoji: '🪙', stat: 'coins', target: 500, rewardCoins: 300, rewardMumbaiBucks: 0, rewardXP: 80 },
  { id: 'd3', type: 'daily', title: 'Street Runner', description: 'Run 1,000 meters total today', emoji: '📏', stat: 'distance', target: 1000, rewardCoins: 250, rewardMumbaiBucks: 0, rewardXP: 60 },
  { id: 'd4', type: 'daily', title: 'Jump King', description: 'Jump 30 times across all runs', emoji: '⬆️', stat: 'jumps', target: 30, rewardCoins: 150, rewardMumbaiBucks: 0, rewardXP: 40 },
  { id: 'd5', type: 'daily', title: 'Power Player', description: 'Use 5 power-ups today', emoji: '⚡', stat: 'powerups', target: 5, rewardCoins: 200, rewardMumbaiBucks: 5, rewardXP: 50 },
  { id: 'd6', type: 'daily', title: 'High Achiever', description: 'Beat your personal high score', emoji: '🏆', stat: 'score', target: 1, rewardCoins: 500, rewardMumbaiBucks: 10, rewardXP: 100 },
];

export const WEEKLY_MISSIONS: Mission[] = [
  { id: 'w1', type: 'weekly', title: 'Marathon Runner', description: 'Complete 50 runs this week', emoji: '🏅', stat: 'runs', target: 50, rewardCoins: 2000, rewardMumbaiBucks: 20, rewardXP: 500 },
  { id: 'w2', type: 'weekly', title: 'Mumbai Millionaire', description: 'Collect 10,000 coins total', emoji: '💰', stat: 'coins', target: 10000, rewardCoins: 3000, rewardMumbaiBucks: 30, rewardXP: 800 },
  { id: 'w3', type: 'weekly', title: 'City Explorer', description: 'Run 50km total this week', emoji: '🗺️', stat: 'distance', target: 50000, rewardCoins: 2500, rewardMumbaiBucks: 25, rewardXP: 600 },
  { id: 'w4', type: 'weekly', title: 'Stunt Master', description: 'Jump 500 times this week', emoji: '🤸', stat: 'jumps', target: 500, rewardCoins: 1500, rewardMumbaiBucks: 15, rewardXP: 400 },
  { id: 'w5', type: 'weekly', title: 'Mumbai Legend', description: 'Score 1,000,000 total points', emoji: '🌟', stat: 'score', target: 1000000, rewardCoins: 5000, rewardMumbaiBucks: 50, rewardXP: 1000 },
];

export const HERO_MISSIONS: Mission[] = [
  { id: 'h1', type: 'hero', title: 'Deliver 10 Orders', description: 'Complete 10 runs as Delivery Boy', emoji: '📦', heroId: 'delivery_boy', stat: 'runs', target: 10, rewardCoins: 500, rewardMumbaiBucks: 0, rewardXP: 150 },
  { id: 'h2', type: 'hero', title: 'Office Sprint', description: 'Run 5km as Office Goer', emoji: '🏢', heroId: 'office_goer', stat: 'distance', target: 5000, rewardCoins: 400, rewardMumbaiBucks: 0, rewardXP: 120 },
  { id: 'h3', type: 'hero', title: 'Campus Run', description: 'Complete 5 runs as College Goer', emoji: '🎓', heroId: 'college_goer', stat: 'runs', target: 5, rewardCoins: 300, rewardMumbaiBucks: 0, rewardXP: 100 },
  { id: 'h4', type: 'hero', title: 'Street King', description: 'Score 50,000 as Tapori', emoji: '😎', heroId: 'tapori', stat: 'score', target: 50000, rewardCoins: 800, rewardMumbaiBucks: 10, rewardXP: 200 },
  { id: 'h5', type: 'hero', title: 'Tiffin Master', description: 'Collect 1000 coins as Dabbawalla', emoji: '🍱', heroId: 'dabbawalla', stat: 'coins', target: 1000, rewardCoins: 600, rewardMumbaiBucks: 5, rewardXP: 150 },
  { id: 'h6', type: 'hero', title: 'Passenger King', description: 'Complete 15 runs as Auto Driver', emoji: '🚕', heroId: 'auto_driver', stat: 'runs', target: 15, rewardCoins: 700, rewardMumbaiBucks: 0, rewardXP: 180 },
];
