import { PLAYER, GAME } from '../constants/gameConfig';

export interface PhysicsState {
  y: number;
  vy: number;
  isOnGround: boolean;
  jumpCount: number;
}

export const createPhysics = (): PhysicsState => ({
  y: PLAYER.groundY,
  vy: 0,
  isOnGround: true,
  jumpCount: 0,
});

export const jump = (state: PhysicsState, canDoubleJump = false): PhysicsState => {
  if (state.isOnGround) {
    return { ...state, vy: PLAYER.jumpForce, isOnGround: false, jumpCount: 1 };
  }
  if (canDoubleJump && state.jumpCount < 2) {
    return { ...state, vy: PLAYER.jumpForce * 0.85, jumpCount: 2 };
  }
  return state;
};

export const tickPhysics = (state: PhysicsState, deltaMs: number): PhysicsState => {
  const dt = deltaMs / 16.67;
  let { y, vy, isOnGround, jumpCount } = state;

  vy += PLAYER.gravity * dt;
  y += vy * dt;

  if (y >= PLAYER.groundY) {
    y = PLAYER.groundY;
    vy = 0;
    isOnGround = true;
    jumpCount = 0;
  }

  return { y, vy, isOnGround, jumpCount };
};
