import { PLAYER, LANES } from '../../constants/gameConfig';

export interface PlayerEntity {
  lane: 0 | 1 | 2;
  x: number;
  y: number;
  width: number;
  height: number;
  isJumping: boolean;
  isSliding: boolean;
  vy: number;
  isOnGround: boolean;
  jumpCount: number;
  shielded: boolean;
  invincibleFrames: number;
}

export const createPlayer = (): PlayerEntity => ({
  lane: 1,
  x: LANES.positions[1],
  y: PLAYER.groundY,
  width: PLAYER.width,
  height: PLAYER.height,
  isJumping: false,
  isSliding: false,
  vy: 0,
  isOnGround: true,
  jumpCount: 0,
  shielded: false,
  invincibleFrames: 0,
});

export const getPlayerBounds = (p: PlayerEntity) => ({
  left: p.x - p.width / 2 + 6,
  right: p.x + p.width / 2 - 6,
  top: p.y - (p.isSliding ? PLAYER.slideHeight : p.height) + 2,
  bottom: p.y,
});
