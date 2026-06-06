import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { GameCanvas } from '../game/GameCanvas';
import { HUD } from '../components/game/HUD';
import { GameOver } from '../components/game/GameOver';
import { PauseMenu } from '../components/game/PauseMenu';
import { useGameStore } from '../store/gameStore';
import { usePlayerStore } from '../store/playerStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { useGestures } from '../hooks/useGestures';
import {
  createEngineState, engineTick, engineJump, engineChangeLane,
  engineSlide, engineStopSlide, GameEngineState, GameEngineEvent,
} from '../game/GameEngine';
import { GAME, POWERUP_DURATIONS } from '../constants/gameConfig';
import { useGameAudio, useGameSfx } from '../audio/useAudio';
import { getHeroById } from '../constants/heroes';

export const GameScreen: React.FC = () => {
  const nav = useNavigation<any>();
  const gameStore = useGameStore();
  const playerStore = usePlayerStore();

  const engineRef = useRef<GameEngineState>(createEngineState());
  const [engineSnapshot, setEngineSnapshot] = useState<GameEngineState>(engineRef.current);
  const distanceRef = useRef(0);
  const slideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { start: startLoop, stop: stopLoop } = useGameLoop();

  const hero = getHeroById(playerStore.selectedHeroId);

  // Hero-specific passives
  const canDoubleJump = hero?.id === 'college_goer' && playerStore.unlockedHeroIds.includes('college_goer');
  const speedBonus = hero?.id === 'delivery_boy' ? 1.10 : 1.0;
  const magnetActive = (hero?.id === 'dabbawalla' && playerStore.unlockedHeroIds.includes('dabbawalla'))
    || useGameStore.getState().activePowerUp === 'vada_pav_magnet'
    || useGameStore.getState().activePowerUp === 'auto_rickshaw_boost';

  useGameAudio();
  const sfx = useGameSfx();

  const handleEvent = useCallback((event: GameEngineEvent) => {
    switch (event.type) {
      case 'COIN_COLLECTED':
        gameStore.addCoin();
        gameStore.incrementCombo();
        sfx.onCoinCollect('coin');
        break;
      case 'POWERUP_COLLECTED': {
        const pu = event.powerUp as any;
        const dur = POWERUP_DURATIONS[pu] ?? 10000;
        sfx.onPowerUp(pu);
        gameStore.activatePowerUp(pu, dur);
        // Power-up side effects
        if (pu === 'ganesh_blessing') {
          // Glowing Modak — divine shield
          engineRef.current = { ...engineRef.current, player: { ...engineRef.current.player, shielded: true } };
        }
        if (pu === 'bollywood_star' || pu === 'nitro_booster' || pu === 'monsoon_boost') {
          engineRef.current = { ...engineRef.current, player: { ...engineRef.current.player, invincibleFrames: 480 } };
        }
        if (pu === 'roof_hop') {
          engineRef.current = { ...engineRef.current, player: { ...engineRef.current.player, jumpCount: 0 } };
        }
        if (pu === 'tiffin_tower') {
          engineRef.current = { ...engineRef.current, player: { ...engineRef.current.player, shielded: true, invincibleFrames: 60 } };
        }
        if (pu === 'shopping_rush') {
          // Instant 500 coins — no duration needed
          gameStore.addCoin(500);
        }
        if (pu === 'movie_magic') {
          // 3x score — handled via scoreMultiplier in addScore calls during tick
          engineRef.current = { ...engineRef.current, player: { ...engineRef.current.player, invincibleFrames: 60 } };
        }
        playerStore.addPowerUpUsed();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      }
      case 'HIT':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        sfx.onHit(event.shielded);
        gameStore.resetCombo();
        break;
      case 'NEAR_MISS':
        sfx.onNearMiss();
        gameStore.registerNearMiss();
        break;
      case 'DEAD':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        sfx.onHit(false);
        gameStore.endGame();
        stopLoop();
        finishRun();
        break;
    }
  }, []);

  const finishRun = useCallback(() => {
    const gs = useGameStore.getState();
    const ps = usePlayerStore.getState();
    // XP multiplier: Office Goer gets +10%
    const xpMult = hero?.id === 'office_goer' ? 1.10 : 1.0;
    const baseXP = Math.floor(gs.distance * 0.5);
    playerStore.addCoins(gs.coinsCollected);
    playerStore.addXP(Math.floor(baseXP * xpMult));
    playerStore.updateHighScore(gs.score);
    playerStore.incrementRuns();
    playerStore.addDistance(gs.distance);
    playerStore.addJumps(gs.jumpsThisRun);
    // Mission progress updates
    playerStore.updateMissionProgress('d1', 1); // runs
    playerStore.updateMissionProgress('d2', gs.coinsCollected);
    playerStore.updateMissionProgress('d3', gs.distance);
    playerStore.updateMissionProgress('d4', gs.jumpsThisRun);
    playerStore.updateMissionProgress('d5', gs.powerUpsUsedThisRun);
    playerStore.saveState();
  }, [hero]);

  const tick = useCallback((delta: number) => {
    const gs = useGameStore.getState();
    if (gs.status !== 'running') return;

    const baseSpeed = Math.min(GAME.baseSpeed + distanceRef.current * GAME.speedIncrement, GAME.maxSpeed);
    const speedMult =
      gs.activePowerUp === 'local_train_turbo' ? 1.8
      : gs.activePowerUp === 'nitro_booster'   ? 2.5
      : gs.activePowerUp === 'monsoon_boost'   ? 1.6
      : gs.activePowerUp === 'tiffin_tower'    ? 1.5
      : 1.0;
    const speed = baseSpeed * speedBonus * speedMult;

    distanceRef.current += speed * (delta / 16.67) * 0.1;

    gameStore.setSpeed(speed);
    gameStore.addDistance(speed * (delta / 16.67) * 0.1);
    gameStore.tickPowerUp(delta);

    const isMagnet = gs.activePowerUp === 'vada_pav_magnet'
      || gs.activePowerUp === 'auto_rickshaw_boost'
      || gs.activePowerUp === 'dabbawalla_rush'
      || gs.activePowerUp === 'tiffin_tower'
      || hero?.id === 'dabbawalla';

    const engineSpeed = gs.activePowerUp === 'dhol_slow' ? speed * 0.5 : speed;

    const next = engineTick(
      engineRef.current,
      delta,
      engineSpeed,
      distanceRef.current,
      isMagnet,
      gs.zone,
      handleEvent,
    );
    engineRef.current = next;
    setEngineSnapshot({ ...next });
  }, [handleEvent, speedBonus, hero]);

  const startGame = useCallback(() => {
    engineRef.current = createEngineState();
    distanceRef.current = 0;
    gameStore.startGame();
    // Auto-shield for tapori (style bonus - free shield if style combo active)
    if (hero?.id === 'auto_driver') {
      engineRef.current = { ...engineRef.current, player: { ...engineRef.current.player } };
    }
    startLoop(tick);
  }, [tick, hero]);

  useEffect(() => {
    startGame();
    return () => stopLoop();
  }, []);

  const handleSwipeUp = useCallback(() => {
    const gs = useGameStore.getState();
    if (gs.status !== 'running') return;
    // ROOF HOP shoe gives triple-jump + super jump force
    const isRoofHop = gs.activePowerUp === 'roof_hop';
    const jumpAllowed = canDoubleJump || isRoofHop;
    engineRef.current = engineJump(engineRef.current, jumpAllowed);
    if (isRoofHop) {
      // Force a higher jump arc when shoe is active
      engineRef.current = {
        ...engineRef.current,
        player: { ...engineRef.current.player, vy: -28 },
      };
    }
    gameStore.registerJump();
    Haptics.impactAsync(isRoofHop ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light);
  }, [canDoubleJump]);

  const handleSwipeLeft = useCallback(() => {
    if (useGameStore.getState().status !== 'running') return;
    engineRef.current = engineChangeLane(engineRef.current, -1);
  }, []);

  const handleSwipeRight = useCallback(() => {
    if (useGameStore.getState().status !== 'running') return;
    engineRef.current = engineChangeLane(engineRef.current, 1);
  }, []);

  const handleSwipeDown = useCallback(() => {
    if (useGameStore.getState().status !== 'running') return;
    sfx.onSlide();
    engineRef.current = engineSlide(engineRef.current);
    clearTimeout(slideTimeoutRef.current!);
    slideTimeoutRef.current = setTimeout(() => {
      engineRef.current = engineStopSlide(engineRef.current);
    }, 600);
  }, []);

  const handleTap = useCallback(() => {
    if (useGameStore.getState().status !== 'running') return;
    sfx.onJump(engineRef.current.player.jumpCount > 0 && canDoubleJump);
    engineRef.current = engineJump(engineRef.current, canDoubleJump);
    gameStore.registerJump();
  }, [canDoubleJump, sfx]);

  const { onTouchStart, onTouchEnd } = useGestures({
    onSwipeLeft: handleSwipeLeft, onSwipeRight: handleSwipeRight,
    onSwipeUp: handleSwipeUp, onSwipeDown: handleSwipeDown, onTap: handleTap,
  });

  const status = gameStore.status;

  return (
    <View style={styles.container} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <GameCanvas engineState={engineSnapshot} heroEmoji={hero?.emoji ?? '🏃'} />
      <HUD onPause={() => gameStore.pauseGame()} />

      {status === 'paused' && (
        <PauseMenu
          onResume={() => { gameStore.resumeGame(); startLoop(tick); }}
          onRestart={() => { stopLoop(); startGame(); }}
          onHome={() => { stopLoop(); nav.goBack(); }}
        />
      )}

      {status === 'dead' && (
        <GameOver
          onRestart={startGame}
          onHome={() => nav.goBack()}
          onRevive={() => {
            if (playerStore.spendMumbaiBucks(10)) {
              engineRef.current = {
                ...engineRef.current,
                player: { ...engineRef.current.player, shielded: true, invincibleFrames: 180 },
              };
              gameStore.startGame();
              startLoop(tick);
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#000' } });
