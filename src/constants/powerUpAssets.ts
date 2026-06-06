/**
 * Power-up & collectible image assets registry.
 * Save images in: assets/powerups/
 * Recommended: 512×512 PNG, transparent or dark background
 *
 * STATUS KEY:  ✅ provided   🔄 reassigned   ⏳ still needed
 *
 * POWER-UP FILE NAMES (save exactly as below):
 *   local_train_turbo.png   ← [✅ BATCH 3] Neon yellow train + green circuit arrow
 *   vada_pav_magnet.png     ← [✅ BATCH 2] Cartoon vada pav + yellow lightning bolts
 *   auto_rickshaw_boost.png ← [✅ BATCH 2] Gold gear + tyre + orange glowing wrench
 *   monsoon_glide.png       ← [✅ BATCH 2] GULLY KING orange+blue neon sneakers + jets
 *   bollywood_star.png      ← [✅ BATCH 1] Orange GULLY headphones + neon soundwaves
 *   ganesh_blessing.png     ← [✅ BATCH 1] Glowing modak on sci-fi gold pedestal
 *   roof_hop.png            ← [✅ BATCH 1] ROOF HOP gold shoe launching off train
 *   campus_boost.png        ← [🔄 BATCH 1] Rocket backpack (Dev Chheda campus ability)
 *
 * COLLECTIBLE FILE NAMES:
 *   vada_pav.png            ← [✅ BATCH 3] Vada pav + cutting chai with fire ring
 *   local_pass.png          ← [✅ BATCH 3] 3D stainless tiffin box + blue+green orbital rings
 *   chai.png                ← [✅ BATCH 1] Golden glowing cutting chai glass (solo)
 *   coin.png                ← [⏳] Mumbai rupee coin
 */

export const POWERUP_ASSETS: Record<string, any> = {
  // === ORIGINAL 7 CORE POWER-UPS ===
  local_train_turbo:   require('../../assets/powerups/local_train_turbo.png'),
  vada_pav_magnet:     require('../../assets/powerups/vada_pav_magnet.png'),
  auto_rickshaw_boost: require('../../assets/powerups/auto_rickshaw_boost.png'),
  monsoon_glide:       require('../../assets/powerups/monsoon_glide.png'),
  bollywood_star:      require('../../assets/powerups/bollywood_star.png'),
  ganesh_blessing:     require('../../assets/powerups/ganesh_blessing.png'),
  roof_hop:            require('../../assets/powerups/roof_hop.png'),
  campus_boost:        require('../../assets/powerups/campus_boost.png'),
  // === NEW POWER-UPS ===
  dhol_slow:           require('../../assets/powerups/dhol_slow.png'),
  monsoon_boost:       require('../../assets/powerups/monsoon_boost.png'),
  movie_magic:         require('../../assets/powerups/movie_magic.png'),
  nitro_booster:       require('../../assets/powerups/nitro_booster.png'),
  dabbawalla_rush:     require('../../assets/powerups/dabbawalla_rush.png'),
  shopping_rush:       require('../../assets/powerups/shopping_rush.png'),
  tiffin_tower:        require('../../assets/powerups/tiffin_tower.png'),
};

export const COLLECTIBLE_ASSETS: Record<string, any> = {
  coin:       require('../../assets/powerups/coin.png'),
  vada_pav:   require('../../assets/powerups/vada_pav.png'),
  local_pass: require('../../assets/powerups/local_pass.png'),
  chai:       require('../../assets/powerups/chai.png'),
  cash:       require('../../assets/powerups/cash.png'),
  // Mumbai Breakfast trio — combined artwork (individual crops not yet available)
  poha:       null,
  samosa:     null,
  upma:       null,
};

export const getPowerUpAsset = (id: string): any => POWERUP_ASSETS[id] ?? null;
export const getCollectibleAsset = (id: string): any => COLLECTIBLE_ASSETS[id] ?? null;

export interface PowerUpMeta {
  name: string;
  description: string;
  emoji: string;
  color: string;
  hudColor: string;
  glowColor: string;
  duration: string;
  artStyle: string;
}

export const POWERUP_META: Record<string, PowerUpMeta> = {

  // ✅ BATCH 3 — Neon yellow train + green circuit arrow
  local_train_turbo: {
    name: 'Local Train Turbo',
    description: 'Mumbai Local Express! Yellow neon train fires up — 1.8x speed, unstoppable!',
    emoji: '🚆',
    color: '#C8FF00',
    hudColor: '#AAFF00',
    glowColor: '#C8FF0044',
    duration: '6 seconds',
    artStyle: 'Neon Mumbai local train (yellow glow) racing into green circuit-board "fast-forward" double-arrow. Dark navy background with subtle grid lines. Train has dark body, glowing yellow windows and headlights.',
  },

  // ✅ BATCH 2 — Cartoon vada pav + yellow lightning bolts
  vada_pav_magnet: {
    name: 'Vada Pav Power!',
    description: 'Ek cutting chai ke saath! Lightning bolts pull every coin straight to you!',
    emoji: '⚡',
    color: '#F5A623',
    hudColor: '#FFD700',
    glowColor: '#FFD70055',
    duration: '12 seconds',
    artStyle: 'Flat cartoon — orange rounded vada pav body, dark brown outline, two yellow lightning bolt icons flanking it left & right, warm yellow radial glow halo, "VADA PAV POWER" white text with black outline.',
  },

  // ✅ BATCH 2 — 3D Gold gear + tyre + orange glowing wrench
  auto_rickshaw_boost: {
    name: 'Auto Turbo',
    description: 'Ramesh Kadam just tuned the engine! Full turbo — speed, magnet, full immunity!',
    emoji: '🔧',
    color: '#FF8C00',
    hudColor: '#FFA040',
    glowColor: '#FF8C0044',
    duration: '8 seconds',
    artStyle: '3D glassmorphism app icon — gold gear with teeth, black rubber tyre inside, large orange neon-rimmed wrench diagonal overlay, frosted glass card background, warm orange inner glow.',
  },

  // ✅ BATCH 2 — GULLY KING neon sneakers + jets
  monsoon_glide: {
    name: 'District Master',
    description: 'GULLY HIGH-VELOCITY! Jet-powered Gully King sneakers — sprint through anything!',
    emoji: '👟',
    color: '#FF4500',
    hudColor: '#FF6B35',
    glowColor: '#FF450044',
    duration: '10 seconds',
    artStyle: '3D premium sneakers — one orange-red, one electric blue, "GULLY KING" neon graffiti, jet booster nozzles at heel, blue fire trails, "DISTRICT MASTER / GULLY HIGH-VELOCITY" graffiti text below.',
  },

  // ✅ BATCH 1 — GULLY orange headphones + neon soundwaves
  bollywood_star: {
    name: 'Gully Beats',
    description: 'GULLY headphones ON — enter the zone! Full invincibility to the Bollywood beat!',
    emoji: '🎧',
    color: '#FF6D00',
    hudColor: '#FF9100',
    glowColor: '#FF6D0044',
    duration: '8 seconds',
    artStyle: '3D gaming headset — orange body, black cushions, "GUILY" headband text, concentric neon blue soundwave rings from each ear cup, dark background with starburst rays.',
  },

  // ✅ BATCH 1 — Glowing modak on sci-fi pedestal
  ganesh_blessing: {
    name: 'Ganesh Blessing',
    description: 'Ganpati Bappa\'s sacred Modak! Divine protection absorbs one hit. Bappa Morya!',
    emoji: '🫓',
    color: '#FFD700',
    hudColor: '#FFE566',
    glowColor: '#FFD70055',
    duration: 'Until hit',
    artStyle: 'White pearl modak with golden top, glowing rune engravings, sci-fi hexagonal pedestal with orange energy ring, teal + purple sparkle stars, dark navy frame with gold corner border.',
  },

  // ✅ BATCH 1 — ROOF HOP gold shoe
  roof_hop: {
    name: 'Roof Hop',
    description: 'The legendary ROOF HOP! Triple jump force — vault over everything on the rooftops!',
    emoji: '👟',
    color: '#F5C518',
    hudColor: '#FFD700',
    glowColor: '#F5C51844',
    duration: '8 seconds',
    artStyle: 'Illustrated gold faceted sneaker mid-launch, yellow speed streaks, explosion from train roof edge, moon-lit circle background, "ROOF HOP" bold yellow text + lightning bolt, rounded gold frame.',
  },

  campus_boost: {
    name: 'Campus Energy',
    description: 'Dev Chheda\'s jetpack activates! Parkour combo bonus — score big on every obstacle!',
    emoji: '🎒',
    color: '#00B4D8',
    hudColor: '#48CAE4',
    glowColor: '#00B4D844',
    duration: '8 seconds',
    artStyle: 'Blue campus backpack, orange buckles & trim, purple straps, gold wing emblem, twin cyan rocket exhausts at bottom, energy swirl trails behind.',
  },

  // === NEW POWER-UPS ===
  dhol_slow: {
    name: 'Dhol Slow-Mo',
    description: 'BOOM! Dhol beat drops — all obstacles slow to half speed for 8 seconds!',
    emoji: '🥁',
    color: '#FF8F00',
    hudColor: '#FFA726',
    glowColor: '#FF8F0044',
    duration: '8 seconds',
    artStyle: 'Orange decorated dhol drum surrounded by a blue electric "SLOW" energy bubble with lightning arcs. Dark background.',
  },

  monsoon_boost: {
    name: 'Monsoon Surge',
    description: 'Mumbai monsoon twister! Water tornado clears the path — full speed immunity!',
    emoji: '🌀',
    color: '#00BCD4',
    hudColor: '#4DD0E1',
    glowColor: '#00BCD455',
    duration: '7 seconds',
    artStyle: 'Glowing cyan water tornado with floating droplets, white starburst radial background, swirling aqua energy.',
  },

  movie_magic: {
    name: 'Movie Magic',
    description: 'Lights! Camera! Action! Bollywood mode — 3x score multiplier, you\'re the star!',
    emoji: '🎬',
    color: '#FFD700',
    hudColor: '#FFE082',
    glowColor: '#FFD70055',
    duration: '10 seconds',
    artStyle: 'Classic black-and-white clapperboard with "MOVIE MAGIC / SCENE 1A / DIRECTOR: PLAYER / DATE: NOW", golden electric glow ring with star sparkles.',
  },

  nitro_booster: {
    name: 'Nitro Boost',
    description: 'NITRO! Maximum velocity — 2.5x speed, full immunity, everything blurs!',
    emoji: '⚡',
    color: '#FF4500',
    hudColor: '#FF6E40',
    glowColor: '#FF450055',
    duration: '5 seconds',
    artStyle: 'Silver double-arrow chevron icon with internal orange plasma energy coil and glowing orb. "NITRO!" bold yellow text below. Sunburst rays background.',
  },

  dabbawalla_rush: {
    name: 'Dabbawalla Rush',
    description: 'Vitthal\'s special route! Tiffin tower power — coin magnet + lane auto-dodge!',
    emoji: '📦',
    color: '#4CAF50',
    hudColor: '#66BB6A',
    glowColor: '#4CAF5055',
    duration: '12 seconds',
    artStyle: 'Futuristic black harness with green neon circuit trim and glowing "D" core module, beside stacked DABBA delivery tiffin boxes with green branding. Dark reflective floor.',
  },

  shopping_rush: {
    name: 'Shopping Rush',
    description: 'Colaba Causeway deal! Gold shopping bag EXPLODES coins — instant 500 coin bonus!',
    emoji: '🛍️',
    color: '#9C27B0',
    hudColor: '#BA68C8',
    glowColor: '#9C27B055',
    duration: 'Instant',
    artStyle: 'Gold premium shopping bag bursting open with colourful mini bags, jewellery, clothes and sparkle confetti on deep purple background. Celebration explosion.',
  },

  tiffin_tower: {
    name: 'Tiffin Tower',
    description: 'Power-up tiffin! Green energy surge — 1.5x speed + full shield + coin magnet!',
    emoji: '🍱',
    color: '#00E676',
    hudColor: '#69F0AE',
    glowColor: '#00E67644',
    duration: '9 seconds',
    artStyle: 'Tall stainless steel tiffin tower with green neon spiral energy swirls and "POWER-UP" cyan lightning bolt text. Dark teal background.',
  },
};

// Canvas glow colours per active power-up
export const POWERUP_GLOW_COLOR: Record<string, string> = {
  local_train_turbo:   '#C8FF0044',
  vada_pav_magnet:     '#FFD70055',
  auto_rickshaw_boost: '#FF8C0044',
  monsoon_glide:       '#FF450044',
  bollywood_star:      '#FF6D0044',
  ganesh_blessing:     '#FFD70055',
  roof_hop:            '#F5C51844',
  campus_boost:        '#00B4D844',
  dhol_slow:           '#FF8F0044',  // dhol orange
  monsoon_boost:       '#00BCD455',  // water blue
  movie_magic:         '#FFD70055',  // gold clapperboard
  nitro_booster:       '#FF450055',  // nitro orange-red
  dabbawalla_rush:     '#4CAF5055',  // dabbawalla green
  shopping_rush:       '#9C27B055',  // shopping purple-gold
  tiffin_tower:        '#00E67644',  // tiffin green glow
};

// Collectible display metadata
export const COLLECTIBLE_META: Record<string, { name: string; emoji: string; color: string; artStyle: string }> = {
  vada_pav: {
    name: 'Vada Pav + Chai Combo',
    emoji: '🍔',
    color: '#FF8C00',
    artStyle: 'Realistic vada pav with golden fried vada showing, second vada pav beside it, cutting chai glass with spoon, all enclosed in swirling orange-yellow FIRE RING on dark background. Mumbai street food energy.',
  },
  local_pass: {
    name: 'Mumbai Dabba Pass',
    emoji: '🍱',
    color: '#00B4D8',
    artStyle: '3D photorealistic stainless steel 3-tier tiffin box with rectangular handle, blue+green orbital/planet rings circling around it, bright royal blue starburst radial background. Premium quality render.',
  },
  chai: {
    name: 'Cutting Chai',
    emoji: '☕',
    color: '#F5A623',
    artStyle: 'Glass cutting chai with Indian decorative pattern, frothy tea, golden glow ring and sparkle stars, steam wisps rising, "CHAI" gold text below. Dark background.',
  },
  coin: {
    name: 'Mumbai Rupee',
    emoji: '🪙',
    color: '#FFD700',
    artStyle: 'Gold coin with ₹ rupee symbol, Gateway of India motifs around the rim, neon glow ring, graffiti wall background.',
  },
  cash: {
    name: '₹500 Cash Bundle',
    emoji: '💵',
    color: '#4CAF50',
    artStyle: 'Thick stack of ₹500 Bank of India notes bound with orange rubber band, golden sparkle particles on dark textured background.',
  },
};
