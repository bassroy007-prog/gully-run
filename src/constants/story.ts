export interface StoryChapter {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  description: string;
  zoneId: string;
  unlockLevel: number;
  missions: string[];
  reward: string;
  bgGradient: [string, string];
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    title: 'Mumbai Beginnings',
    subtitle: 'Morning Rush',
    emoji: '🌅',
    description: 'Every legend starts somewhere. Your journey begins in the heart of Mumbai\'s bustling gully streets.',
    zoneId: 'gully',
    unlockLevel: 1,
    missions: ['Complete 5 runs', 'Score 5,000 points', 'Collect 200 coins'],
    reward: '500 Coins + Office Goer Unlock',
    bgGradient: ['#FF6B35', '#E65100'],
  },
  {
    id: 2,
    title: 'Local Train Madness',
    subtitle: 'Rush Hour',
    emoji: '🚂',
    description: 'The Mumbai local — the lifeline of the city. Crowded, chaotic, and completely thrilling.',
    zoneId: 'local_train',
    unlockLevel: 5,
    missions: ['Reach Local Train zone', 'Complete 10 train runs', 'Jump 100 times'],
    reward: '1000 Coins + College Goer Unlock',
    bgGradient: ['#1565C0', '#0288D1'],
  },
  {
    id: 3,
    title: 'Festival Fever',
    subtitle: 'Ganesh Utsav',
    emoji: '🐘',
    description: 'The streets explode with color, music, and devotion. Ganesh Chaturthi transforms all of Mumbai.',
    zoneId: 'festival',
    unlockLevel: 10,
    missions: ['Collect 50 Festival Tokens', 'Run during Ganesh event', 'Score 25,000 points'],
    reward: '2000 Coins + Tapori Unlock',
    bgGradient: ['#E65100', '#FF8F00'],
  },
  {
    id: 4,
    title: 'Monsoon Mayhem',
    subtitle: 'Season of Chaos',
    emoji: '🌧️',
    description: 'Mumbai\'s monsoon turns the city into an obstacle course. Puddles everywhere, but the spirit never drowns.',
    zoneId: 'monsoon',
    unlockLevel: 15,
    missions: ['Survive monsoon zone', 'Collect 30 Monsoon Glide power-ups', 'Run 10km total'],
    reward: '3000 Coins + Dabbawalla Unlock',
    bgGradient: ['#0277BD', '#01579B'],
  },
  {
    id: 5,
    title: 'Bollywood Dreams',
    subtitle: 'Lights, Camera, Action!',
    emoji: '🎬',
    description: 'Every Mumbaikar dreams of Bollywood. The sets are glamorous, the lights are blinding, the energy is electric.',
    zoneId: 'bollywood',
    unlockLevel: 20,
    missions: ['Reach Bollywood zone', 'Collect 20 Bollywood Star power-ups', 'Score 100,000 points'],
    reward: '5000 Coins + Auto Driver Unlock',
    bgGradient: ['#880E4F', '#C62828'],
  },
  {
    id: 6,
    title: 'Marine Drive Nights',
    subtitle: 'Queen\'s Necklace',
    emoji: '🌊',
    description: 'The most beautiful stretch of any city in the world. Marine Drive at night is pure magic.',
    zoneId: 'marine_drive',
    unlockLevel: 25,
    missions: ['Master Marine Drive zone', 'Near-miss 50 obstacles', 'Collect 5000 coins total'],
    reward: '8000 Coins + Exclusive Skin',
    bgGradient: ['#006064', '#00838F'],
  },
  {
    id: 7,
    title: 'City Champion',
    subtitle: 'Rise of the Legend',
    emoji: '🏆',
    description: 'You\'ve run every street, conquered every zone. Now prove you\'re truly Mumbai\'s greatest runner.',
    zoneId: 'night_mumbai',
    unlockLevel: 35,
    missions: ['Score 500,000 total', 'Unlock all 6 heroes', 'Win 10 daily challenges'],
    reward: '15000 Coins + 100 Mumbai Bucks + Legendary Title',
    bgGradient: ['#4A148C', '#6A1B9A'],
  },
  {
    id: 8,
    title: 'Mumbai Legend',
    subtitle: 'The Ultimate Run',
    emoji: '🌟',
    description: 'The final chapter. The ultimate test. Only the greatest runners of Mumbai can claim this title.',
    zoneId: 'night_mumbai',
    unlockLevel: 50,
    missions: ['Reach Level 50', 'Score 1,000,000 in a single run', 'Master all zones'],
    reward: 'Legendary Badge + 500 Mumbai Bucks + Exclusive Hero Skin',
    bgGradient: ['#FF6B35', '#FFD700'],
  },
];
