import type { EnemyType, PowerUpType } from "../types";

export const TOTAL_STAGES = 3;

interface StageEnemyConfig {
  enemies: EnemyType[];
  fixedCounts?: Partial<Record<EnemyType, number>>;
}

const STAGE_ENEMY_CONFIG: Record<number, StageEnemyConfig> = {
  1: {
    enemies: [
      "tomato",
      "fork",
      "grater",
      "basil",
      "colander",
    ],
    fixedCounts: {
      colander: 2,
    },
  },

  2: {
    enemies: [
      "ravioli",
      "pepper-grinder",
      "meatball",
      "pasta-pot",
      "colander",
    ],
    fixedCounts: {
      "pepper-grinder": 1,
      meatball: 2,
      "pasta-pot": 1,
      colander: 2,
    },
  },
};

const POWER_UP_UNLOCK_ORDER: PowerUpType[] = [
  "salsa-rossa",
  "pesto",
  "parmesan",
  "garlic",
];

const getStageEnemyConfig = (stage: number): StageEnemyConfig =>
  STAGE_ENEMY_CONFIG[stage] ?? STAGE_ENEMY_CONFIG[1];

export const getUnlockedEnemies = (
  stage: number,
  wave: number,
  totalWaves: number,
): EnemyType[] => {
  const { enemies } = getStageEnemyConfig(stage);

  if (totalWaves <= 0) {
    return enemies.slice(0, 1);
  }

  const progress = wave / totalWaves;

  const unlockedCount = Math.min(
    enemies.length,
    Math.max(
      1,
      Math.ceil(progress * enemies.length),
    ),
  );

  return enemies.slice(0, unlockedCount);
};

export const getFixedEnemyCounts = (
  stage: number,
  wave: number,
  totalWaves: number,
): Partial<Record<EnemyType, number>> => {
  const config = getStageEnemyConfig(stage);
  const unlockedEnemies = getUnlockedEnemies(
    stage,
    wave,
    totalWaves,
  );

  const result: Partial<Record<EnemyType, number>> = {};

  for (
    const [type, count] of Object.entries(
      config.fixedCounts ?? {},
    ) as [EnemyType, number][]
  ) {
    if (unlockedEnemies.includes(type)) {
      result[type] = count;
    }
  }

  return result;
};

export const getUnlockedPowerUps = (
  stage: number,
): PowerUpType[] => {
  const count = Math.min(
    stage,
    POWER_UP_UNLOCK_ORDER.length,
  );

  return POWER_UP_UNLOCK_ORDER.slice(0, count);
};