export const BACKGROUND_ASSETS: Record<string, any[]> = {
  gully:        [require('../../assets/backgrounds/gully.png'),        require('../../assets/backgrounds/gully_alt.png')],
  marine_drive: [require('../../assets/backgrounds/marine_drive.png'), require('../../assets/backgrounds/marine_drive_alt.png')],
  local_train:  [require('../../assets/backgrounds/local_train.png'),  require('../../assets/backgrounds/local_train_alt.png')],
  bollywood:    [require('../../assets/backgrounds/bollywood.png')],
  monsoon:      [require('../../assets/backgrounds/monsoon.png'),       require('../../assets/backgrounds/monsoon_alt.png')],
  festival:     [require('../../assets/backgrounds/festival.png')],
  night_mumbai: [require('../../assets/backgrounds/night_mumbai.png'), require('../../assets/backgrounds/night_mumbai_alt.png')],
};

// Cycle through variants every 500m of distance
export const getBackgroundAsset = (zoneId: string, distance: number = 0): any => {
  const variants = BACKGROUND_ASSETS[zoneId] ?? BACKGROUND_ASSETS.gully;
  const idx = Math.floor(distance / 500) % variants.length;
  return variants[idx];
};
