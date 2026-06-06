import { PlayerEntity, getPlayerBounds } from '../entities/Player';
import { Obstacle } from '../entities/Obstacle';
import { Collectible } from '../entities/Collectible';
import { LANES } from '../../constants/gameConfig';

export const checkObstacleCollision = (player: PlayerEntity, obstacle: Obstacle): boolean => {
  if (player.lane !== obstacle.lane) return false;
  if (player.invincibleFrames > 0) return false;

  const pb = getPlayerBounds(player);
  const ob = {
    left: obstacle.x - obstacle.width / 2 + 4,
    right: obstacle.x + obstacle.width / 2 - 4,
    top: obstacle.y,
    bottom: obstacle.y + obstacle.height,
  };

  return pb.right > ob.left && pb.left < ob.right && pb.bottom > ob.top && pb.top < ob.bottom;
};

export const checkCollectibleCollision = (player: PlayerEntity, collectible: Collectible): boolean => {
  const magnetActive = false;
  const px = LANES.positions[player.lane];
  const py = player.y - 36;

  const dx = px - collectible.x;
  const dy = py - collectible.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  return dist < collectible.radius + 28;
};

export const checkMagnetPull = (player: PlayerEntity, collectible: Collectible): boolean => {
  const px = LANES.positions[player.lane];
  const py = player.y - 36;
  const dx = px - collectible.x;
  const dy = py - collectible.y;
  return Math.sqrt(dx * dx + dy * dy) < 140;
};
