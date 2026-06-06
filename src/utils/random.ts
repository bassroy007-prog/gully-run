export const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const randomInt = (min: number, max: number) =>
  Math.floor(randomBetween(min, max + 1));

export const randomChoice = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const chance = (probability: number) => Math.random() < probability;
