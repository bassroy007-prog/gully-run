/**
 * Character artwork registry.
 * Place the 6 character PNG files in assets/characters/
 * then require() them here. The game uses these for:
 *   - Hero selection screen cards
 *   - Game HUD portrait
 *   - Victory/Game Over screens
 *   - Onboarding hero picker
 *
 * File naming convention (save your images as):
 *   assets/characters/delivery_boy.png   → Bunty Kamble (green Gully Eats)
 *   assets/characters/office_goer.png    → Sanjay Pillai (blue shirt)
 *   assets/characters/college_goer.png   → Dev Chheda (orange "Cutting Chai" tee)
 *   assets/characters/tapori.png         → Chiku Rane (floral shirt, flat cap)
 *   assets/characters/dabbawalla.png     → Vitthal Shinde (white kurta, tiffins)
 *   assets/characters/auto_driver.png    → Ramesh Kadam (khaki uniform + auto)
 */

// Placeholder: replace each null with require('../../../assets/characters/hero.png')
// once image files are placed in the folder.
export const CHARACTER_ASSETS: Record<string, any> = {
  delivery_boy:  require('../../assets/characters/delivery_boy.png'),
  office_goer:   require('../../assets/characters/office_goer.png'),
  college_goer:  require('../../assets/characters/college_goer.png'),
  tapori:        require('../../assets/characters/tapori.png'),
  dabbawalla:    require('../../assets/characters/dabbawalla.png'),
  auto_driver:   require('../../assets/characters/auto_driver.png'),
};

// Card portrait (cropped square version)
export const CHARACTER_PORTRAITS: Record<string, any> = {
  delivery_boy:  require('../../assets/characters/delivery_boy.png'),
  office_goer:   require('../../assets/characters/office_goer.png'),
  college_goer:  require('../../assets/characters/college_goer.png'),
  tapori:        require('../../assets/characters/tapori.png'),
  dabbawalla:    require('../../assets/characters/dabbawalla.png'),
  auto_driver:   require('../../assets/characters/auto_driver.png'),
};

export const getCharacterAsset = (heroId: string) => CHARACTER_ASSETS[heroId] ?? null;
export const getCharacterPortrait = (heroId: string) => CHARACTER_PORTRAITS[heroId] ?? null;
