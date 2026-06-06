import { Audio } from 'expo-av';

const SFX_FILES: Record<string, any> = {
  coin:            require('../../assets/audio/sfx/coin final.mp3'),
  cash:            require('../../assets/audio/sfx/cash final.mp3'),
  cash_register:   require('../../assets/audio/sfx/cash register final.mp3'),
  jump:            require('../../assets/audio/sfx/jump final.mp3'),
  double_jump:     require('../../assets/audio/sfx/double jump final.mp3'),
  slide:           require('../../assets/audio/sfx/slide final.mp3'),
  land:            require('../../assets/audio/sfx/land final.mp3'),
  hit:             require('../../assets/audio/sfx/hit final.mp3'),
  shield_break:    require('../../assets/audio/sfx/sheild break final.mp3'),
  near_miss:       require('../../assets/audio/sfx/near miss final.mp3'),
  power_up:        require('../../assets/audio/sfx/power up collect final.mp3'),
  bollywood_sting: require('../../assets/audio/sfx/bollywood sting final.mp3'),
  clapperboard:    require('../../assets/audio/sfx/clapperboard final.mp3'),
  nitro_roar:      require('../../assets/audio/sfx/nitro roar final.mp3'),
  dhol_boom:       require('../../assets/audio/sfx/dhol boom final.mp3'),
  temple_bell:     require('../../assets/audio/sfx/temple bell final.mp3'),
  police_siren:    require('../../assets/audio/sfx/police siren final.mp3'),
  moo:             require('../../assets/audio/sfx/moo final.mp3'),
  dog_bark:        require('../../assets/audio/sfx/dog bark final.mp3'),
  countdown:       require('../../assets/audio/sfx/countdown final.mp3'),
  victory:         require('../../assets/audio/sfx/victory final.mp3'),
  game_over:       require('../../assets/audio/sfx/game over final.mp3'),
};

const MUSIC_FILES: Record<string, any> = {
  menu:         require('../../assets/audio/music/Menu Bollywood final.mp3'),
  gully:        require('../../assets/audio/music/Gully Street Beat final.mp3'),
  marine_drive: require('../../assets/audio/music/Marine Drive Breeze final.mp3'),
  local_train:  require('../../assets/audio/music/Local Train Turbo final.mp3'),
  bollywood:    require('../../assets/audio/music/Bollywood Masala final.mp3'),
  monsoon:      require('../../assets/audio/music/Monsoon Rhythm final.mp3'),
  festival:     require('../../assets/audio/music/Ganesh Dhol final.mp3'),
  night_mumbai: require('../../assets/audio/music/Night Mumbai Neon final.mp3'),
  game_over:    null,
};

class AudioManagerClass {
  private sfxEnabled = true;
  private musicEnabled = true;
  private sfxVolume = 1.0;
  private musicVolume = 0.7;
  public musicSound: Audio.Sound | null = null;
  private currentTrack: string | null = null;
  private fadeInterval: ReturnType<typeof setInterval> | null = null;

  async init() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    } catch (_) {}
  }

  async playSfx(name: string) {
    if (!this.sfxEnabled) return;
    const file = SFX_FILES[name];
    if (!file) return;
    try {
      const { sound } = await Audio.Sound.createAsync(file, { volume: this.sfxVolume });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      });
      await sound.playAsync();
    } catch (_) {}
  }

  async playMusic(track: string, fadeIn = true) {
    if (!this.musicEnabled) return;
    const file = MUSIC_FILES[track];
    if (!file) return;
    if (this.currentTrack === track) return;

    await this.stopMusic(true);
    this.currentTrack = track;

    try {
      const { sound } = await Audio.Sound.createAsync(file, {
        isLooping: true,
        volume: fadeIn ? 0 : this.musicVolume,
      });
      this.musicSound = sound;
      await sound.playAsync();

      if (fadeIn) {
        let vol = 0;
        this.fadeInterval = setInterval(async () => {
          vol = Math.min(vol + 0.05, this.musicVolume);
          await sound.setVolumeAsync(vol).catch(() => {});
          if (vol >= this.musicVolume) {
            clearInterval(this.fadeInterval!);
            this.fadeInterval = null;
          }
        }, 100);
      }
    } catch (_) {}
  }

  async stopMusic(fadeOut = true) {
    const sound = this.musicSound;
    if (!sound) return;
    this.musicSound = null;
    this.currentTrack = null;

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    if (fadeOut) {
      let vol = this.musicVolume;
      const iv = setInterval(async () => {
        vol = Math.max(vol - 0.1, 0);
        await sound.setVolumeAsync(vol).catch(() => {});
        if (vol <= 0) {
          clearInterval(iv);
          await sound.stopAsync().catch(() => {});
          await sound.unloadAsync().catch(() => {});
        }
      }, 80);
    } else {
      await sound.stopAsync().catch(() => {});
      await sound.unloadAsync().catch(() => {});
    }
  }

  async transitionToZone(zoneId: string) {
    if (MUSIC_FILES[zoneId]) await this.playMusic(zoneId);
  }

  setMusicEnabled(v: boolean) { this.musicEnabled = v; if (!v) this.stopMusic(false); }
  setSfxEnabled(v: boolean) { this.sfxEnabled = v; }
  setMusicVolume(v: number) { this.musicVolume = v; }
  setSfxVolume(v: number) { this.sfxVolume = v; }
}

export const AudioManager = new AudioManagerClass();
