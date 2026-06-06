# 🏃 Gully Run — Mumbai Chapter

An endless runner mobile game set in the streets of Mumbai. Dodge obstacles, collect coins, grab power-ups, and race through iconic Mumbai zones — all with an authentic Bollywood-inspired soundtrack.

Built with **React Native + Expo SDK 56** and **@shopify/react-native-skia** for smooth 2D game rendering.

---

## 📱 Platforms

- Android (APK via EAS Build)
- iOS (via EAS Build)

---

## 🎮 Gameplay

- **Swipe Up / Tap** — Jump (double-jump for College Goer hero)
- **Swipe Down** — Slide under obstacles
- **Swipe Left / Right** — Change lane
- Collect coins, cash, and power-ups
- Dodge 16 Mumbai obstacles: taxis, holy cows, police vans, laundry lines, and more
- Score multipliers, combo system, and near-miss bonuses

---

## 🗺️ Zones

| Zone | Vibe |
|---|---|
| Gully | Old Mumbai streets |
| Marine Drive | Coastal breeze |
| Local Train | Mumbai suburban rush |
| Bollywood | Film city glamour |
| Monsoon | Rainy season chaos |
| Festival | Ganesh Chaturthi energy |
| Night Mumbai | Neon city nights |

Each zone has its own background art, obstacle set, spawn pool, and dynamic music track.

---

## 🦸 Heroes

6 unlockable heroes with unique passives:

| Hero | Passive |
|---|---|
| Gully Kid | Starter hero |
| College Goer | Double jump |
| Delivery Boy | +10% speed |
| Dabbawalla | Permanent magnet |
| Auto Driver | Style combo bonus |
| Office Goer | +10% XP per run |

---

## ⚡ Power-Ups

15 Mumbai-themed power-ups including:
- **Vada Pav Magnet** — pulls all coins nearby
- **Local Train Turbo** — 1.8× speed burst
- **Ganesh Blessing** — divine shield
- **Bollywood Star** — invincibility + style
- **Dhol Slow** — slow-motion bullet time
- **Shopping Rush** — instant 500 coins
- **Movie Magic** — 3× score multiplier
- and 8 more…

---

## 🎵 Audio

**8 zone music tracks** (dynamic zone transitions with fade):
- Menu Bollywood, Gully Street Beat, Marine Drive Breeze, Local Train Turbo, Bollywood Masala, Monsoon Rhythm, Ganesh Dhol, Night Mumbai Neon

**22 SFX** covering: coin collect, cash register, jump, double-jump, slide, land, hit, shield break, near miss, power-up collect, bollywood sting, nitro roar, dhol boom, temple bell, police siren, moo, dog bark, countdown, victory, game over.

---

## 🛠️ Tech Stack

| Library | Purpose |
|---|---|
| Expo SDK 56 | Managed workflow, EAS builds |
| React Native 0.85 | Core framework |
| @shopify/react-native-skia 2.6.2 | 2D game canvas rendering |
| react-native-reanimated 4.3.1 | Animations & worklets |
| react-native-worklets 0.8 | Reanimated worklet runtime |
| Zustand 5 | Game + player state management |
| expo-av 16 | Audio playback (SFX + music) |
| @react-navigation/native-stack | Screen navigation |
| expo-haptics | Haptic feedback |

---

## 🏗️ Project Structure

```
src/
├── audio/          # AudioManager singleton + React hooks
├── components/     # HUD, GameOver, PauseMenu, Shop, etc.
├── constants/      # Theme, game config, asset registries
├── game/
│   ├── entities/   # Obstacle, Collectible, Player types
│   ├── systems/    # SpawnSystem, collision logic
│   ├── GameCanvas.tsx   # Skia canvas renderer
│   └── GameEngine.ts    # Pure tick function, no side effects
├── hooks/          # useGameLoop, useGestures
├── navigation/     # AppNavigator (native-stack)
├── screens/        # GameScreen, HomeScreen, HeroesScreen, etc.
└── store/          # gameStore, playerStore, heroStore, cityStore

assets/
├── audio/
│   ├── music/      # 8 zone MP3 tracks
│   └── sfx/        # 22 SFX MP3 files
├── backgrounds/    # Zone background PNGs (2 variants each)
├── characters/     # Hero artwork
├── obstacles/      # 16 obstacle PNGs
└── powerups/       # 15 power-up artwork PNGs
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo`
- EAS CLI: `npm install -g eas-cli`

### Install

```bash
git clone https://github.com/bass-roy007/gully-run.git
cd gully-run
npm install
```

### Run locally

```bash
npx expo start
```

Requires a custom dev client (uses Skia native module — not compatible with Expo Go).

### Build APK (Android)

```bash
eas build --platform android --profile preview
```

### Build for production

```bash
eas build --platform all --profile production
```

---

## ☁️ EAS Configuration

- **Project ID:** `73f56aeb-b9b2-42fb-8763-d5e2059dc69b`
- **EAS Account:** `@bass.roy_007/gully-run`
- **Profiles:** `development` (APK + iOS sim), `preview` (internal APK), `production` (AAB + App Store)

---

## 📄 License

MIT — feel free to fork and build your own city chapter.
