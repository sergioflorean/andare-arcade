import type { EnemyType, PowerUpType } from "../types";

export const TOTAL_STAGES = 3;

const ENEMY_UNLOCK_ORDER: EnemyType[] = [
  "tomato",
  "fork",
  "grater",
  "basil",
  "colander",
];

const POWER_UP_UNLOCK_ORDER: PowerUpType[] = [
  "salsa-rossa",
  "pesto",
  "parmesan",
  "garlic",
];

export const getUnlockedEnemies = (
  wave: number,
  totalWaves: number,
): EnemyType[] => {
  if (totalWaves <= 0) return ["tomato"];

  const progress = wave / totalWaves;

  const unlockedCount = Math.min(
    ENEMY_UNLOCK_ORDER.length,
    Math.max(1, Math.ceil(progress * ENEMY_UNLOCK_ORDER.length)),
  );

  return ENEMY_UNLOCK_ORDER.slice(0, unlockedCount);
};

export const getFixedEnemyCounts = (
  wave: number,
  totalWaves: number,
): Partial<Record<EnemyType, number>> => {
  const unlockedEnemies = getUnlockedEnemies(wave, totalWaves);

  return unlockedEnemies.includes("colander")
    ? { colander: 2 }
    : {};
};

export const getUnlockedPowerUps = (stage: number): PowerUpType[] => {
  const count = Math.min(stage, POWER_UP_UNLOCK_ORDER.length);
  return POWER_UP_UNLOCK_ORDER.slice(0, count);
};