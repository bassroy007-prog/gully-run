export const OBSTACLE_ASSETS: Record<string, any> = {
  // === ORIGINAL (emoji fallback — no art yet) ===
  rickshaw:       null,
  bus:            null,
  construction:   null,
  train:          null,
  water_puddle:   null,
  speed_breaker:  null,
  traffic_police: null,
  // === HAS ARTWORK ===
  street_dog:     require('../../assets/obstacles/street_dog.png'),
  fruit_cart:     require('../../assets/obstacles/fruit_cart.png'),
  barricade:      require('../../assets/obstacles/barricade.png'),
  festival_crowd: require('../../assets/obstacles/crowd.png'),
  pothole:        require('../../assets/obstacles/pothole.png'),
  taxi:           require('../../assets/obstacles/taxi.png'),
  holy_cow:       require('../../assets/obstacles/holy_cow.png'),
  laundry_line:   require('../../assets/obstacles/laundry_line.png'),
  electric_wires: require('../../assets/obstacles/electric_wires.png'),
  fire_hydrant:   require('../../assets/obstacles/fire_hydrant.png'),
  police_van:     require('../../assets/obstacles/police_van.png'),
  manhole:        require('../../assets/obstacles/manhole.png'),
  crowd:          require('../../assets/obstacles/crowd.png'),
  cycle:          require('../../assets/obstacles/cycle.png'),
  kirana_stall:   require('../../assets/obstacles/kirana_stall.png'),
  fruit_basket:   require('../../assets/obstacles/fruit_basket.png'),
};

export const getObstacleAsset = (type: string): any => OBSTACLE_ASSETS[type] ?? null;
