import { LANES, PLAYER, GAME } from '../constants/gameConfig';
import { PlayerEntity, createPlayer } from './entities/Player';
import { Obstacle } from './entities/Obstacle';
import { Collectible, isPowerUp } from './entities/Collectible';
import { checkObstacleCollision, checkCollectibleCollision } from './systems/CollisionSystem';
import { SpawnState, createSpawnState, trySpawnObstacle, trySpawnCollectible } from './systems/SpawnSystem';
import { jump, tickPhysics } from './Physics';

export interface GameEngineState {
  player: PlayerEntity;
  obstacles: Obstacle[];
  collectibles: Collectible[];
  spawn: SpawnState;
  backgroundX: number;
}

export type GameEngineEvent =
  | { type: 'COIN_COLLECTED'; value: number }
  | { type: 'POWERUP_COLLECTED'; powerUp: string }
  | { type: 'HIT'; shielded: boolean }
  | { type: 'NEAR_MISS' }
  | { type: 'DEAD' };

export const createEngineState = (): GameEngineState => ({
  player: createPlayer(),
  obstacles: [],
  collectibles: [],
  spawn: createSpawnState(),
  backgroundX: 0,
});

export const engineJump = (state: GameEngineState, canDoubleJump = false): GameEngineState => {
  const physics = jump(
    { y: state.player.y, vy: state.player.vy, isOnGround: state.player.isOnGround, jumpCount: state.player.jumpCount },
    canDoubleJump,
  );
  return { ...state, player: { ...state.player, ...physics, isJumping: !physics.isOnGround } };
};

export const engineChangeLane = (state: GameEngineState, direction: -1 | 1): GameEngineState => {
  const newLane = Math.max(0, Math.min(2, state.player.lane + direction)) as 0 | 1 | 2;
  return { ...state, player: { ...state.player, lane: newLane, x: LANES.positions[newLane] } };
};

export const engineSlide = (state: GameEngineState): GameEngineState => ({
  ...state, player: { ...state.player, isSliding: true },
});

export const engineStopSlide = (state: GameEngineState): GameEngineState => ({
  ...state, player: { ...state.player, isSliding: false },
});

export const engineTick = (
  state: GameEngineState,
  deltaMs: number,
  speed: number,
  distance: number,
  magnetActive: boolean,
  zone: string,
  onEvent: (e: GameEngineEvent) => void,
): GameEngineState => {
  const dt = deltaMs / 16.67;
  const dx = speed * dt;

  // Physics
  const physics = tickPhysics(
    { y: state.player.y, vy: state.player.vy, isOnGround: state.player.isOnGround, jumpCount: state.player.jumpCount },
    deltaMs,
  );

  let player: PlayerEntity = {
    ...state.player,
    ...physics,
    isJumping: !physics.isOnGround,
    x: LANES.positions[state.player.lane],
    invincibleFrames: Math.max(0, state.player.invincibleFrames - 1),
  };

  // Move obstacles
  let obstacles = state.obstacles
    .map(o => ({ ...o, x: o.x - dx }))
    .filter(o => o.x > -120);

  // Move collectibles (with magnet pull)
  let collectibles = state.collectibles
    .map(c => {
      let x = c.x - dx;
      if (magnetActive && !c.collected) {
        const px = LANES.positions[player.lane];
        const py = player.y - 36;
        const ddx = px - c.x;
        const ddy = py - c.y;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dist < 160) x = c.x + (ddx / dist) * 9;
      }
      return { ...c, x };
    })
    .filter(c => c.x > -60);

  // Background parallax
  const backgroundX = (state.backgroundX - dx * 0.4) % 800;

  // Spawn
  let spawn = state.spawn;
  const obsResult = trySpawnObstacle(distance, spawn, speed, zone);
  if (obsResult.obstacle) {
    obstacles = [...obstacles, obsResult.obstacle];
    spawn = obsResult.state;
  }
  const colResult = trySpawnCollectible(distance, spawn);
  if (colResult.collectible) {
    collectibles = [...collectibles, colResult.collectible];
    spawn = colResult.state;
  }

  // Collect
  collectibles = collectibles.map(c => {
    if (c.collected) return c;
    if (checkCollectibleCollision(player, c)) {
      if (isPowerUp(c.type)) {
        onEvent({ type: 'POWERUP_COLLECTED', powerUp: c.type });
      } else {
        onEvent({ type: 'COIN_COLLECTED', value: c.value });
      }
      return { ...c, collected: true };
    }
    return c;
  }).filter(c => !c.collected);

  // Obstacle collision + near miss detection
  for (const obs of obstacles) {
    if (checkObstacleCollision(player, obs)) {
      if (player.shielded) {
        player = { ...player, shielded: false, invincibleFrames: 90 };
        onEvent({ type: 'HIT', shielded: true });
      } else if (player.invincibleFrames <= 0) {
        onEvent({ type: 'DEAD' });
        return { ...state, player, obstacles, collectibles, spawn, backgroundX };
      }
    } else if (
      obs.lane === player.lane &&
      Math.abs(obs.x - LANES.positions[player.lane]) < obs.width / 2 + 20 &&
      player.invincibleFrames <= 0
    ) {
      onEvent({ type: 'NEAR_MISS' });
    }
  }

  return { player, obstacles, collectibles, spawn, backgroundX };
};
