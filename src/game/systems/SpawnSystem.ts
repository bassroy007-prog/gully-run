import { SPAWN, PLAYER } from '../../constants/gameConfig';
import {
  Obstacle, COMMON_OBSTACLES, ADVANCED_OBSTACLES,
  GULLY_OBSTACLES, MONSOON_OBSTACLES, FESTIVAL_OBSTACLES, TRAIN_OBSTACLES,
  createObstacle,
} from '../entities/Obstacle';
import { Collectible, CollectibleType, POWER_UP_TYPES, COIN_TYPES, createCollectible } from '../entities/Collectible';
import { randomBetween, randomInt, randomChoice, chance } from '../../utils/random';

export interface SpawnState {
  nextObstacleAt: number;
  nextCollectibleAt: number;
}

export const createSpawnState = (): SpawnState => ({
  nextObstacleAt: 400,
  nextCollectibleAt: 200,
});

export const trySpawnObstacle = (
  distance: number,
  state: SpawnState,
  speed: number,
  zone: string,
): { obstacle: Obstacle | null; state: SpawnState } => {
  if (distance < state.nextObstacleAt) return { obstacle: null, state };

  const zonePool =
    zone === 'gully'        ? GULLY_OBSTACLES
    : zone === 'monsoon'    ? MONSOON_OBSTACLES
    : zone === 'festival'   ? FESTIVAL_OBSTACLES
    : zone === 'local_train'? TRAIN_OBSTACLES
    : speed > 14            ? ADVANCED_OBSTACLES
    : COMMON_OBSTACLES;
  const type = randomChoice(zonePool);
  const lane = randomInt(0, 2);
  const obstacle = createObstacle(type, lane, PLAYER.groundY);
  const gap = randomBetween(SPAWN.minObstacleGap, SPAWN.maxObstacleGap) / (speed / 6);

  return {
    obstacle,
    state: { ...state, nextObstacleAt: distance + gap },
  };
};

export const trySpawnCollectible = (
  distance: number,
  state: SpawnState,
): { collectible: Collectible | null; state: SpawnState } => {
  if (distance < state.nextCollectibleAt) return { collectible: null, state };

  const isPowerUp = chance(SPAWN.powerUpChance);
  const lane = randomInt(0, 2);
  const type: CollectibleType = isPowerUp
    ? randomChoice(POWER_UP_TYPES)
    : randomChoice(COIN_TYPES);

  const collectible = createCollectible(type, lane, PLAYER.groundY);

  return {
    collectible,
    state: { ...state, nextCollectibleAt: distance + randomBetween(80, 180) },
  };
};
