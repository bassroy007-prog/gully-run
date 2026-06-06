export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface HeroStats {
  speed: number;    // 1–5
  jump: number;     // 1–5
  coins: number;    // 1–5
  agility: number;  // 1–5
}

export interface Hero {
  id: string;
  name: string;
  nickname: string;
  title: string;
  rarity: Rarity;
  emoji: string;
  // Visual identity from actual character art
  primaryColor: string;   // dominant color from artwork
  secondaryColor: string; // secondary color
  bgGradient: [string, string];
  accentColor: string;
  description: string;
  story: string;
  passiveSkill: string;
  activeSkill: string;
  activeSkillName: string;
  passiveBonus: number;
  stats: HeroStats;
  unlockCost: number;
  unlockCurrency: 'free' | 'coins' | 'mumbaiBucks' | 'mission';
  maxLevel: number;
  ultimateRank: string;
  signatureMove: string;
  victoryScreen: string;
  collectibles: string[];
  voiceLines: string[];
}

export const HEROES: Hero[] = [
  {
    id: 'delivery_boy',
    name: 'Bunty Kamble',
    nickname: 'Rocket Bunty',
    title: 'Delivery Boy',
    rarity: 'common',
    emoji: '🛵',
    primaryColor: '#4CAF50',    // Gully Eats green uniform
    secondaryColor: '#1B5E20',
    bgGradient: ['#1B5E20', '#33691E'],
    accentColor: '#8BC34A',
    description: 'Gully Eats ka sabse tez delivery hero. Phone haath mein, order mind mein, raasta dil mein.',
    story: 'Bunty started with a second-hand cycle in Dharavi. Now he runs Mumbai\'s fastest food delivery service — "Gully Eats". Still does every delivery himself because nobody rides faster than Bunty Kamble.',
    passiveSkill: '+10% base run speed every run',
    activeSkill: 'Turbo Delivery — bike boost mode activates, 2x speed + invincibility for 8 seconds',
    activeSkillName: 'Turbo Delivery',
    passiveBonus: 0.10,
    stats: { speed: 5, jump: 3, coins: 3, agility: 4 },
    unlockCost: 0,
    unlockCurrency: 'free',
    maxLevel: 30,
    ultimateRank: 'Delivery King of Mumbai',
    signatureMove: 'Bike wheelie with phone notification pop-ups flashing',
    victoryScreen: '⭐⭐⭐⭐⭐ Customer Rating Screen — "Best Delivery Ever!"',
    collectibles: ['📦 Orders', '🏆 Delivery Badges', '🍕 Restaurant Tokens'],
    voiceLines: [
      '"Order aaya bhai, road clear karo!"',
      '"Bunty ka time waste nahi hota!"',
      '"Gully Eats — fastest in Mumbai!"',
    ],
  },
  {
    id: 'office_goer',
    name: 'Sanjay Pillai',
    nickname: '9:55 Sanjay',
    title: 'Office Goer',
    rarity: 'common',
    emoji: '👔',
    primaryColor: '#90CAF9',    // light blue shirt
    secondaryColor: '#1A237E',  // dark trousers
    bgGradient: ['#0D47A1', '#1565C0'],
    accentColor: '#42A5F5',
    description: 'Haar roz late. Haar roz bhagta hai. Haar roz bach jaata hai. That\'s Mumbai corporate life, bhai.',
    story: 'Sanjay Pillai from Bandra has been "5 minutes away" from his Nariman Point office for 3 years. He checks his watch 47 times per run. His briefcase has never once been opened. But his attendance record? Perfect.',
    passiveSkill: '+10% XP earned from every run',
    activeSkill: 'Rush Hour Focus — time slows briefly, all obstacles freeze for 4 seconds',
    activeSkillName: 'Rush Hour Focus',
    passiveBonus: 0.10,
    stats: { speed: 4, jump: 3, coins: 4, agility: 3 },
    unlockCost: 800,
    unlockCurrency: 'coins',
    maxLevel: 30,
    ultimateRank: 'Corporate Boss',
    signatureMove: 'Running while glancing at wristwatch, briefcase swinging wildly',
    victoryScreen: '📈 Promotion Ceremony — "Employee of the Month: SANJAY PILLAI"',
    collectibles: ['☕ Coffee Cups', '🪪 Attendance Cards', '⭐ Promotion Stars'],
    voiceLines: [
      '"9:58 ho gaya... BHAGO!"',
      '"Boss ko mat batao, I was stuck in traffic!"',
      '"Yaar aaj meeting hai... aaj bhi meeting hai..."',
    ],
  },
  {
    id: 'college_goer',
    name: 'Dev Chheda',
    nickname: 'Chai Dev',
    title: 'College Student',
    rarity: 'rare',
    emoji: '🎓',
    primaryColor: '#FF6B00',    // signature orange tee "Cutting Chai Anyone?"
    secondaryColor: '#212121',  // ripped jeans, dark
    bgGradient: ['#E65100', '#BF360C'],
    accentColor: '#FF9800',
    description: 'Orange tee. Ripped jeans. "Cutting Chai Anyone?" T-shirt. Backpack full of... chai packets probably.',
    story: 'Dev Chheda from Vile Parle never misses a class — because he\'s always sprinting to reach one. His T-shirt says "Cutting Chai Anyone?" but he\'s running too fast to stop. His parkour skills were learned avoiding the college security guard.',
    passiveSkill: 'Double Jump unlocked permanently — parkour mode',
    activeSkill: 'Campus Energy — parkour combo activates, +150 bonus score per obstacle cleared for 12 seconds',
    activeSkillName: 'Campus Energy',
    passiveBonus: 1,
    stats: { speed: 3, jump: 5, coins: 3, agility: 5 },
    unlockCost: 2000,
    unlockCurrency: 'coins',
    maxLevel: 30,
    ultimateRank: 'Campus Legend',
    signatureMove: 'Backpack swing mid-air flip + selfie pose landing',
    victoryScreen: '🎭 Campus Celebrity Celebration — "Dev Chheda — Most Popular Student Award"',
    collectibles: ['📚 Books', '📝 Notes', '🎫 Festival Passes'],
    voiceLines: [
      '"Cutting chai koi deta kya? Bhagna padega baad mein!"',
      '"Yaar ek baar aur jump!"',
      '"Security uncle phir aa gaye!"',
    ],
  },
  {
    id: 'tapori',
    name: 'Chiku Rane',
    nickname: 'Gully Chiku',
    title: 'Tapori',
    rarity: 'rare',
    emoji: '😎',
    primaryColor: '#FF6B6B',    // floral print shirt — colorful
    secondaryColor: '#4A4A4A',  // dark jeans, flat cap
    bgGradient: ['#880E4F', '#C62828'],
    accentColor: '#FF80AB',
    description: 'Floral shirt. Flat cap. Light-up shoes. Chiku Rane is Mumbai\'s most stylish street runner.',
    story: 'Chiku Rane from Kurla has never run from anything — he runs TOWARDS the action. His floral shirt is his flag, his flat cap is his crown, and his glowing sneakers are his superpower. Every slide, every vault, every near-miss gets him style points.',
    passiveSkill: 'Style Multiplier — combo bonuses earn +50% extra score',
    activeSkill: 'Bhai Style — wall run + stunt bonuses activate for 10 seconds, massive score multiplier',
    activeSkillName: 'Bhai Style',
    passiveBonus: 0.50,
    stats: { speed: 4, jump: 4, coins: 5, agility: 5 },
    unlockCost: 5000,
    unlockCurrency: 'coins',
    maxLevel: 40,
    ultimateRank: 'King of the Gullies',
    signatureMove: 'Low crouch sprint with light trails blazing from shoes',
    victoryScreen: '👑 Street King Dance Celebration — "Gully Chiku — Unbeatable!"',
    collectibles: ['⛓️ Gold Chains', '✨ Style Points', '🪙 Lucky Coins'],
    voiceLines: [
      '"Kya scene hai bhai!"',
      '"Style toh dekho, aise hi chalte hain hum!"',
      '"Ek gully mein do Chiku nahi hote!"',
    ],
  },
  {
    id: 'dabbawalla',
    name: 'Vitthal Shinde',
    nickname: 'Tiffin King',
    title: 'Dabbawalla',
    rarity: 'epic',
    emoji: '📦',
    primaryColor: '#F5F5F5',    // white kurta
    secondaryColor: '#8D6E63',  // leather satchel, sandals
    bgGradient: ['#37474F', '#263238'],
    accentColor: '#78909C',
    description: 'Safed kurta. Safed topi. Tiffin upar, haath niche, dopahar ka khaana deliver hoga — zaroor.',
    story: 'Vitthal Shinde has not missed a single delivery in 23 years. He can balance 8 tiffin boxes on his head while running through a crowded Churchgate station. His accuracy: 99.999%. His speed: legendary. His expression: always determined.',
    passiveSkill: '+15% coins collected every run',
    activeSkill: 'Perfect Route — auto lane selection + coin magnet activate simultaneously for 12 seconds',
    activeSkillName: 'Perfect Route',
    passiveBonus: 0.15,
    stats: { speed: 3, jump: 3, coins: 5, agility: 3 },
    unlockCost: 10000,
    unlockCurrency: 'coins',
    maxLevel: 40,
    ultimateRank: 'Master Dabbawalla — Mumbai Legend',
    signatureMove: 'Sprinting with stacked tiffin tower perfectly balanced on head',
    victoryScreen: '🍱 Delivery Legend Ceremony — "Vitthal Shinde — 10,000 Deliveries Without a Miss!"',
    collectibles: ['🍱 Tiffin Boxes', '📬 Delivery Stamps', '⭐ Customer Ratings'],
    voiceLines: [
      '"Tiffin late hone nahi deta main kabhi!"',
      '"Churchgate se Andheri — 43 minutes, koi nahi kar sakta!"',
      '"Dabbawalla ki zindagi mein traffic jam nahi hota!"',
    ],
  },
  {
    id: 'auto_driver',
    name: 'Ramesh Kadam',
    nickname: 'Meter Down Ramesh',
    title: 'Auto Rickshaw Wala',
    rarity: 'epic',
    emoji: '🚕',
    primaryColor: '#FFD600',    // black & yellow auto colors
    secondaryColor: '#212121',  // olive/khaki uniform
    bgGradient: ['#212121', '#424242'],
    accentColor: '#FFD600',
    description: 'Kabu Naka ka king. Name tag mein Ramesh, dil mein Mumbai. Towel kandhe pe, auto haath mein.',
    story: 'Ramesh Kadam\'s name tag has been on his shirt since 1998. His auto "MUMBAI TAXI" has seen every corner of the city. He knows every shortcut, every signal timing, every pothole in Mumbai. His turbo ride? Completely unbeatable.',
    passiveSkill: 'Traffic Ignore — rickshaw and bus obstacles deal 50% less damage',
    activeSkill: 'Meter Down Turbo — enters auto ride mode: ultra speed + coin magnet + obstacle immunity for 10 seconds',
    activeSkillName: 'Meter Down Turbo',
    passiveBonus: 0.50,
    stats: { speed: 3, jump: 3, coins: 3, agility: 3 },
    unlockCost: 150,
    unlockCurrency: 'mumbaiBucks',
    maxLevel: 40,
    ultimateRank: 'Roads of Mumbai Champion',
    signatureMove: 'Idle: cleaning auto windshield | Victory: rhythmic honking dance',
    victoryScreen: '🛺 King of Mumbai Roads — "Ramesh Kadam — Sabse Tez Auto Driver!"',
    collectibles: ['🎫 Passenger Tokens', '💰 Fare Coins', '⭐ Tip Stars', '⛽ Fuel Cans'],
    voiceLines: [
      '"Meter down? Meter down nahi hota bhai, seedha turbo!"',
      '"Bolo kahan jaana hai — lekin traffic mein mat jaana!"',
      '"Mumbai ka sabse tez auto... aur driver bhi!"',
    ],
  },
];

export const getHeroById = (id: string) => HEROES.find(h => h.id === id);
export const getHeroesByRarity = (rarity: Rarity) => HEROES.filter(h => h.rarity === rarity);

export const HERO_STATS_TABLE = {
  delivery_boy: { passive: '+10% Speed', active: 'Turbo Delivery',  emoji: '🛵' },
  office_goer:  { passive: '+10% XP',    active: 'Time Slow',       emoji: '👔' },
  college_goer: { passive: 'Double Jump', active: 'Campus Energy',  emoji: '🎓' },
  tapori:       { passive: 'Style +50%', active: 'Bhai Style',      emoji: '😎' },
  dabbawalla:   { passive: '+15% Coins', active: 'Perfect Route',   emoji: '📦' },
  auto_driver:  { passive: 'Traffic -50%', active: 'Meter Down',    emoji: '🚕' },
} as const;
