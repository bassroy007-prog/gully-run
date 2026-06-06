export interface Festival {
  id: string;
  name: string;
  emoji: string;
  description: string;
  duration: number;
  bonusMultiplier: number;
  exclusiveHeroId?: string;
  specialObstacle: string;
  specialCollectible: string;
  bgAccent: string;
  startMonth: number;
  startDay: number;
}

export const FESTIVALS: Festival[] = [
  {
    id: 'diwali',
    name: 'Diwali Dhamaka',
    emoji: '🪔',
    description: 'Festival of lights! Diyas everywhere, fireworks as obstacles!',
    duration: 14,
    bonusMultiplier: 2.0,
    exclusiveHeroId: 'bollywood',
    specialObstacle: 'Fireworks Burst',
    specialCollectible: 'Diya (10x value)',
    bgAccent: '#FF6B35',
    startMonth: 10,
    startDay: 20,
  },
  {
    id: 'ganesh',
    name: 'Ganesh Utsav',
    emoji: '🐘',
    description: 'Ganpati Bappa Morya! Run through the procession!',
    duration: 10,
    bonusMultiplier: 1.5,
    exclusiveHeroId: 'tapori',
    specialObstacle: 'Procession Float',
    specialCollectible: 'Modak (5x value)',
    bgAccent: '#FF9800',
    startMonth: 9,
    startDay: 1,
  },
  {
    id: 'holi',
    name: 'Holi Run',
    emoji: '🎨',
    description: 'Bura na mano, Holi hai! Colors everywhere!',
    duration: 7,
    bonusMultiplier: 1.75,
    specialObstacle: 'Color Balloon',
    specialCollectible: 'Color Packet (power-up)',
    bgAccent: '#E91E63',
    startMonth: 3,
    startDay: 10,
  },
  {
    id: 'ipl',
    name: 'IPL Season',
    emoji: '🏏',
    description: 'Cricket fever! Run through the stadium!',
    duration: 60,
    bonusMultiplier: 1.25,
    exclusiveHeroId: 'cricket',
    specialObstacle: 'Incoming Delivery',
    specialCollectible: 'Cricket Ball (3x value)',
    bgAccent: '#2196F3',
    startMonth: 4,
    startDay: 1,
  },
  {
    id: 'monsoon',
    name: 'Monsoon Madness',
    emoji: '🌧️',
    description: 'Mumbai floods! Every puddle is a trap!',
    duration: 20,
    bonusMultiplier: 1.5,
    exclusiveHeroId: 'monsoon',
    specialObstacle: 'Flash Flood',
    specialCollectible: 'Umbrella (shield)',
    bgAccent: '#00B4D8',
    startMonth: 7,
    startDay: 1,
  },
];
