import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Canvas, Rect, Circle, RoundedRect, Group } from '@shopify/react-native-skia';
import { SCREEN, LANES, PLAYER } from '../constants/gameConfig';
import { GameEngineState } from './GameEngine';
import { useGameStore } from '../store/gameStore';
import { COLORS } from '../constants/theme';
import { getPowerUpAsset, getCollectibleAsset, POWERUP_GLOW_COLOR } from '../constants/powerUpAssets';
import { isPowerUp } from './entities/Collectible';
import { getBackgroundAsset } from '../constants/backgroundAssets';
import { getObstacleAsset } from '../constants/obstacleAssets';

interface Props {
  engineState: GameEngineState;
  heroEmoji?: string;
}

const ZONE_VISUALS: Record<string, { sky: string; ground: string; building: string; accent: string }> = {
  gully:        { sky: '#120805', ground: '#2E1A10', building: '#5D3A1A', accent: '#FF6B35' },
  marine_drive: { sky: '#050F1A', ground: '#0A1E2E', building: '#0D3A6B', accent: '#00B4D8' },
  local_train:  { sky: '#080812', ground: '#101025', building: '#2A2A4A', accent: '#FFD700' },
  bollywood:    { sky: '#120310', ground: '#200520', building: '#6A0545', accent: '#E91E63' },
  monsoon:      { sky: '#040412', ground: '#080818', building: '#0D1A2E', accent: '#00BCD4' },
  festival:     { sky: '#150800', ground: '#251200', building: '#7A3500', accent: '#FF8F00' },
  night_mumbai: { sky: '#020208', ground: '#05050F', building: '#0A0A1E', accent: '#9C27B0' },
};

const GROUND_Y = PLAYER.groundY;
const LANE_W = LANES.width;

export const GameCanvas: React.FC<Props> = ({ engineState, heroEmoji = '🏃' }) => {
  const { player, obstacles, collectibles, backgroundX } = engineState;
  const zone = useGameStore(s => s.zone);
  const activePowerUp = useGameStore(s => s.activePowerUp);
  const distance = useGameStore(s => s.distance);
  const col = ZONE_VISUALS[zone] || ZONE_VISUALS.gully;

  const playerX = LANES.positions[player.lane];
  const playerH = player.isSliding ? PLAYER.slideHeight : PLAYER.height;
  const playerY = player.y - playerH;
  const isInvincible = player.invincibleFrames > 0;

  // Player tint — exactly matches dominant colour from each uploaded artwork
  const playerColor =
    activePowerUp === 'local_train_turbo'    ? '#C8FF00'   // Neon Train — electric yellow-green
    : activePowerUp === 'bollywood_star'     ? '#FF6D00'   // GULLY Headphones — orange
    : activePowerUp === 'auto_rickshaw_boost'? '#FF8C00'   // Mechanic Wrench — deep orange
    : activePowerUp === 'ganesh_blessing'    ? '#FFD700'   // Glowing Modak — gold
    : activePowerUp === 'roof_hop'           ? '#F5C518'   // ROOF HOP Shoe — warm gold
    : activePowerUp === 'monsoon_glide'      ? '#FF4500'   // GULLY KING — neon orange-red
    : activePowerUp === 'vada_pav_magnet'    ? '#F5A623'   // Vada Pav Power — warm amber
    : activePowerUp === 'campus_boost'       ? '#00B4D8'   // Campus backpack — cyan
    : activePowerUp === 'dhol_slow'          ? '#FF8F00'   // Dhol — amber orange
    : activePowerUp === 'monsoon_boost'      ? '#00BCD4'   // Water tornado — teal
    : activePowerUp === 'movie_magic'        ? '#FFD700'   // Clapperboard — gold
    : activePowerUp === 'nitro_booster'      ? '#FF4500'   // Nitro — blazing red-orange
    : activePowerUp === 'dabbawalla_rush'    ? '#4CAF50'   // Dabbawalla circuit — green
    : activePowerUp === 'tiffin_tower'       ? '#00E676'   // Tiffin tower — bright green
    : COLORS.saffron;

  const bgAsset = getBackgroundAsset(zone, distance);

  return (
  <View style={styles.wrapper}>
    {/* Photo background — full-screen zone art */}
    <Image
      source={bgAsset}
      style={styles.background}
      resizeMode="cover"
    />

    {/* Dark vignette overlay — helps game elements pop over busy backgrounds */}
    <View style={[styles.vignette, { backgroundColor: `${col.sky}55` }]} />

    <Canvas style={styles.canvas}>
      {/* Subtle ground plane — semi-transparent so background photo shows through */}
      <Rect x={0} y={GROUND_Y} width={SCREEN.W} height={SCREEN.H - GROUND_Y} color={`${col.ground}CC`} />

      {/* Ground line accent */}
      <Rect x={0} y={GROUND_Y} width={SCREEN.W} height={3} color={col.accent + 'AA'} />

      {/* Lane dividers */}
      {[1, 2].map(i => (
        <Rect key={`ld${i}`} x={LANE_W * i - 1} y={GROUND_Y} width={2} height={SCREEN.H - GROUND_Y} color="rgba(255,255,255,0.12)" />
      ))}

      {/* Lane dash markings */}
      {[1, 2].map(li =>
        [0, 1, 2, 3, 4].map(di => (
          <Rect
            key={`dm${li}${di}`}
            x={LANE_W * li - 1}
            y={GROUND_Y + 18 + di * 38 + ((backgroundX * 0.9) % 38)}
            width={2}
            height={16}
            color="rgba(255,255,255,0.2)"
          />
        ))
      )}

      {/* Obstacles — shadow only; image rendered as RN Image below canvas */}
      {obstacles.map(obs => (
        <Group key={obs.id}>
          {/* Colored hitbox shown only when no artwork */}
          {!getObstacleAsset(obs.type) && (
            <RoundedRect
              x={obs.x - obs.width / 2}
              y={obs.y}
              width={obs.width}
              height={obs.height}
              r={10}
              color={obs.color}
            />
          )}
          {/* Ground shadow */}
          <Rect
            x={obs.x - obs.width / 2 + 4}
            y={obs.y + obs.height - 4}
            width={obs.width - 8}
            height={6}
            color="rgba(0,0,0,0.35)"
          />
        </Group>
      ))}

      {/* Collectibles */}
      {collectibles.map(col2 => (
        <Group key={col2.id}>
          {/* Outer glow */}
          <Circle cx={col2.x} cy={col2.y} r={col2.radius + 4} color={`${col2.color}33`} />
          {/* Main circle */}
          <Circle cx={col2.x} cy={col2.y} r={col2.radius} color={col2.color} />
          {/* Inner shine */}
          <Circle cx={col2.x - 3} cy={col2.y - 3} r={col2.radius * 0.35} color="rgba(255,255,255,0.4)" />
        </Group>
      ))}

      {/* Player shadow */}
      <Rect
        x={playerX - 18}
        y={GROUND_Y - 3}
        width={36}
        height={6}
        color="rgba(0,0,0,0.4)"
      />

      {/* Ganesh Blessing — Glowing Modak golden shield ring */}
      {player.shielded && (
        <>
          <Circle cx={playerX} cy={playerY + playerH / 2} r={46} color="rgba(255,215,0,0.20)" />
          <Circle cx={playerX} cy={playerY + playerH / 2} r={42} color="rgba(255,215,0,0.15)" />
        </>
      )}

      {/* VADA PAV POWER — yellow lightning bolt glow (matches artwork yellow bolts) */}
      {activePowerUp === 'vada_pav_magnet' && (
        <>
          <Circle cx={playerX} cy={playerY + playerH / 2} r={60} color="rgba(245,166,35,0.12)" />
          <Circle cx={playerX} cy={playerY + playerH / 2} r={44} color="rgba(255,215,0,0.18)" />
          {/* Lightning bolt streaks left & right — matches artwork */}
          <Rect x={playerX - 52} y={playerY + 8} width={6} height={20} color="rgba(255,215,0,0.6)" />
          <Rect x={playerX + 46} y={playerY + 8} width={6} height={20} color="rgba(255,215,0,0.6)" />
        </>
      )}

      {/* AUTO TURBO — mechanic orange wrench glow (warm radial from gear icon) */}
      {activePowerUp === 'auto_rickshaw_boost' && (
        <>
          <Circle cx={playerX} cy={playerY + playerH / 2} r={50} color="rgba(255,140,0,0.15)" />
          <Circle cx={playerX} cy={playerY + playerH / 2} r={38} color="rgba(255,140,0,0.22)" />
        </>
      )}

      {/* GULLY HEADPHONES (Bollywood Star) — orange soundwave concentric rings */}
      {activePowerUp === 'bollywood_star' && (
        <>
          <Circle cx={playerX} cy={playerY + playerH / 2} r={58} color="rgba(255,109,0,0.10)" />
          <Circle cx={playerX} cy={playerY + playerH / 2} r={46} color="rgba(255,109,0,0.16)" />
          <Circle cx={playerX} cy={playerY + playerH / 2} r={34} color="rgba(255,109,0,0.22)" />
        </>
      )}

      {/* DISTRICT MASTER sneakers — dual orange+blue ring from each shoe (matches neon colours) */}
      {activePowerUp === 'monsoon_glide' && (
        <>
          <Circle cx={playerX - 14} cy={player.y} r={20} color="rgba(255,69,0,0.30)" />
          <Circle cx={playerX + 14} cy={player.y} r={20} color="rgba(0,123,255,0.30)" />
          <Rect x={playerX - 4} y={player.y} width={8} height={24} color="rgba(0,123,255,0.35)" />
        </>
      )}

      {/* ROOF HOP Shoe — gold launch rings beneath feet */}
      {activePowerUp === 'roof_hop' && (
        <>
          <Circle cx={playerX} cy={player.y} r={34} color="rgba(245,197,24,0.28)" />
          <Circle cx={playerX} cy={player.y} r={20} color="rgba(245,197,24,0.38)" />
        </>
      )}

      {/* LOCAL TRAIN TURBO — neon yellow-green speed trail */}
      {activePowerUp === 'local_train_turbo' && (
        <>
          <Circle cx={playerX} cy={playerY + playerH / 2} r={50} color="rgba(200,255,0,0.12)" />
          <Circle cx={playerX} cy={playerY + playerH / 2} r={36} color="rgba(200,255,0,0.18)" />
          <Rect x={playerX - PLAYER.width / 2 - 28} y={playerY + 10} width={24} height={4} color="#C8FF0066" />
          <Rect x={playerX - PLAYER.width / 2 - 40} y={playerY + 22} width={32} height={3} color="#00FF4444" />
          <Rect x={playerX - PLAYER.width / 2 - 20} y={playerY + 34} width={16} height={3} color="#C8FF0044" />
        </>
      )}

      {/* CAMPUS BOOST — cyan backpack rocket exhaust rings */}
      {activePowerUp === 'campus_boost' && (
        <>
          <Circle cx={playerX} cy={playerY + playerH / 2} r={48} color="rgba(0,180,216,0.12)" />
          <Circle cx={playerX} cy={playerY + playerH / 2} r={34} color="rgba(0,180,216,0.20)" />
          <Rect x={playerX - PLAYER.width / 2 - 24} y={playerY + 12} width={18} height={3} color="rgba(0,180,216,0.50)" />
          <Rect x={playerX - PLAYER.width / 2 - 36} y={playerY + 24} width={28} height={2} color="rgba(72,202,228,0.40)" />
        </>
      )}

      {/* DHOL SLOW — orange shockwave rings around player (slow-mo bubble) */}
      {activePowerUp === 'dhol_slow' && (
        <>
          <Circle cx={playerX} cy={playerY + playerH / 2} r={64} color="rgba(255,143,0,0.08)" />
          <Circle cx={playerX} cy={playerY + playerH / 2} r={50} color="rgba(255,143,0,0.14)" />
          <Circle cx={playerX} cy={playerY + playerH / 2} r={36} color="rgba(255,143,0,0.20)" />
        </>
      )}

      {/* MONSOON BOOST — cyan water tornado swirl rings */}
      {activePowerUp === 'monsoon_boost' && (
        <>
          <Circle cx={playerX} cy={playerY + playerH / 2} r={56} color="rgba(0,188,212,0.10)" />
          <Circle cx={playerX} cy={playerY + playerH / 2} r={40} color="rgba(0,188,212,0.18)" />
          <Circle cx={playerX} cy={player.y} r={22} color="rgba(0,188,212,0.28)" />
          <Rect x={playerX - PLAYER.width / 2 - 34} y={playerY + 8}  width={28} height={3} color="rgba(0,188,212,0.55)" />
          <Rect x={playerX - PLAYER.width / 2 - 46} y={playerY + 22} width={38} height={2} color="rgba(0,188,212,0.40)" />
          <Rect x={playerX - PLAYER.width / 2 - 26} y={playerY + 36} width={20} height={2} color="rgba(0,188,212,0.35)" />
        </>
      )}

      {/* MOVIE MAGIC — gold clapperboard star sparkle rings */}
      {activePowerUp === 'movie_magic' && (
        <>
          <Circle cx={playerX} cy={playerY + playerH / 2} r={58} color="rgba(255,215,0,0.08)" />
          <Circle cx={playerX} cy={playerY + playerH / 2} r={44} color="rgba(255,215,0,0.14)" />
          <Circle cx={playerX} cy={playerY + playerH / 2} r={30} color="rgba(255,215,0,0.22)" />
          {/* Gold shimmer streaks */}
          <Rect x={playerX - PLAYER.width / 2 - 32} y={playerY + 6}  width={26} height={3} color="rgba(255,215,0,0.55)" />
          <Rect x={playerX - PLAYER.width / 2 - 44} y={playerY + 20} width={36} height={2} color="rgba(255,215,0,0.40)" />
        </>
      )}

      {/* NITRO BOOSTER — intense orange-red speed rings + thick trail */}
      {activePowerUp === 'nitro_booster' && (
        <>
          <Circle cx={playerX} cy={playerY + playerH / 2} r={52} color="rgba(255,69,0,0.10)" />
          <Circle cx={playerX} cy={playerY + playerH / 2} r={38} color="rgba(255,69,0,0.18)" />
          <Rect x={playerX - PLAYER.width / 2 - 40} y={playerY + 6}  width={34} height={5} color="rgba(255,69,0,0.65)" />
          <Rect x={playerX - PLAYER.width / 2 - 54} y={playerY + 18} width={46} height={4} color="rgba(255,140,0,0.50)" />
          <Rect x={playerX - PLAYER.width / 2 - 30} y={playerY + 32} width={24} height={3} color="rgba(255,69,0,0.45)" />
        </>
      )}

      {/* DABBAWALLA RUSH — green circuit magnet ring */}
      {activePowerUp === 'dabbawalla_rush' && (
        <>
          <Circle cx={playerX} cy={playerY + playerH / 2} r={60} color="rgba(76,175,80,0.10)" />
          <Circle cx={playerX} cy={playerY + playerH / 2} r={44} color="rgba(76,175,80,0.16)" />
          <Circle cx={playerX} cy={playerY + playerH / 2} r={30} color="rgba(76,175,80,0.22)" />
        </>
      )}

      {/* TIFFIN TOWER — green spiral energy: speed + shield + magnet combo */}
      {activePowerUp === 'tiffin_tower' && (
        <>
          <Circle cx={playerX} cy={playerY + playerH / 2} r={56} color="rgba(0,230,118,0.10)" />
          <Circle cx={playerX} cy={playerY + playerH / 2} r={42} color="rgba(0,230,118,0.16)" />
          <Circle cx={playerX} cy={playerY + playerH / 2} r={28} color="rgba(0,230,118,0.24)" />
          <Rect x={playerX - PLAYER.width / 2 - 30} y={playerY + 10} width={24} height={3} color="rgba(0,230,118,0.55)" />
          <Rect x={playerX - PLAYER.width / 2 - 42} y={playerY + 24} width={34} height={2} color="rgba(0,230,118,0.40)" />
        </>
      )}

      {/* Player body */}
      {(!isInvincible || player.invincibleFrames % 6 < 3) && (
        <RoundedRect
          x={playerX - PLAYER.width / 2}
          y={playerY}
          width={PLAYER.width}
          height={playerH}
          r={12}
          color={playerColor}
        />
      )}

      {/* Auto rickshaw vehicle mode */}
      {activePowerUp === 'auto_rickshaw_boost' && (
        <Group>
          <RoundedRect x={playerX - 40} y={playerY - 10} width={80} height={playerH + 20} r={14} color="#FFD600AA" />
          <RoundedRect x={playerX - 35} y={playerY + playerH + 5} width={20} height={10} r={5} color="#333" />
          <RoundedRect x={playerX + 15} y={playerY + playerH + 5} width={20} height={10} r={5} color="#333" />
        </Group>
      )}

      {/* Monsoon glide water trail */}
      {activePowerUp === 'monsoon_glide' && (
        <Rect x={playerX - 20} y={player.y} width={40} height={6} color="#00BCD455" />
      )}
    </Canvas>

    {/* Obstacle artwork images */}
    {obstacles.map(obs => {
      const asset = getObstacleAsset(obs.type);
      if (!asset) return null;
      return (
        <Image
          key={`obs_img_${obs.id}`}
          source={asset}
          style={[styles.collectibleImg, {
            left: obs.x - obs.width / 2,
            top: obs.y,
            width: obs.width,
            height: obs.height,
          }]}
          resizeMode="contain"
        />
      );
    })}

    {/* Collectible images */}
    {collectibles.map(col2 => {
      const asset = isPowerUp(col2.type)
        ? getPowerUpAsset(col2.type)
        : getCollectibleAsset(col2.type);
      if (!asset) return null;
      const size = isPowerUp(col2.type) ? 44 : 30;
      return (
        <Image
          key={`img_${col2.id}`}
          source={asset}
          style={[styles.collectibleImg, {
            left: col2.x - size / 2,
            top: col2.y - size / 2,
            width: size,
            height: size,
          }]}
          resizeMode="contain"
        />
      );
    })}
  </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: SCREEN.W,
    height: SCREEN.H,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  background: {
    position: 'absolute',
    width: SCREEN.W,
    height: SCREEN.H,
    top: 0,
    left: 0,
  },
  vignette: {
    position: 'absolute',
    width: SCREEN.W,
    height: SCREEN.H,
    top: 0,
    left: 0,
  },
  canvas: {
    width: SCREEN.W,
    height: SCREEN.H,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  collectibleImg: {
    position: 'absolute',
  },
});
