import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { AudioManager } from './AudioManager';

export const useAudioInit = () => {
  useEffect(() => {
    AudioManager.init().then(() => {
      AudioManager.playMusic('menu');
    });
    return () => {
      AudioManager.stopMusic(false);
    };
  }, []);
};

export const useGameAudio = () => {
  const status = useGameStore(s => s.status);
  const zone = useGameStore(s => s.zone);
  const prevStatus = useRef(status);
  const prevZone = useRef(zone);

  useEffect(() => {
    if (status === 'running' && prevStatus.current !== 'running') {
      AudioManager.transitionToZone(zone);
    }
    if (status === 'dead' && prevStatus.current !== 'dead') {
      AudioManager.playSfx('game_over');
      AudioManager.stopMusic(true);
    }
    if (status === 'idle' && prevStatus.current !== 'idle') {
      AudioManager.playMusic('menu');
    }
    prevStatus.current = status;
  }, [status]);

  useEffect(() => {
    if (status === 'running' && zone !== prevZone.current) {
      AudioManager.transitionToZone(zone);
    }
    prevZone.current = zone;
  }, [zone, status]);
};

export const useGameSfx = () => ({
  onCoinCollect: (type: string) => {
    AudioManager.playSfx(type === 'cash' ? 'cash' : 'coin');
  },
  onJump: (isDouble: boolean) => {
    AudioManager.playSfx(isDouble ? 'double_jump' : 'jump');
  },
  onSlide: () => AudioManager.playSfx('slide'),
  onLand: () => AudioManager.playSfx('land'),
  onNearMiss: () => AudioManager.playSfx('near_miss'),
  onHit: (shielded: boolean) => {
    AudioManager.playSfx(shielded ? 'shield_break' : 'hit');
  },
  onPowerUp: (type: string) => {
    if (type === 'bollywood_star' || type === 'movie_magic') {
      AudioManager.playSfx('bollywood_sting');
    } else if (type === 'nitro_booster' || type === 'local_train_turbo') {
      AudioManager.playSfx('nitro_roar');
    } else if (type === 'dhol_slow') {
      AudioManager.playSfx('dhol_boom');
    } else if (type === 'ganesh_blessing') {
      AudioManager.playSfx('temple_bell');
    } else if (type === 'shopping_rush') {
      AudioManager.playSfx('cash_register');
    } else if (type === 'movie_magic') {
      AudioManager.playSfx('clapperboard');
    } else {
      AudioManager.playSfx('power_up');
    }
  },
  onVictory: () => AudioManager.playSfx('victory'),
  onCountdown: () => AudioManager.playSfx('countdown'),
  onObstacle: (type: string) => {
    if (type === 'holy_cow') AudioManager.playSfx('moo');
    else if (type === 'police_van') AudioManager.playSfx('police_siren');
    else if (type === 'stray_dog') AudioManager.playSfx('dog_bark');
  },
});
