import Phaser from "phaser";

import {
  getFixedEnemyCounts,
  getUnlockedEnemies,
} from "../config/progressionConfig";

import type { EnemyPattern, EnemyType } from "../types";
import type { WaveDifficulty } from "./waveConfig";

export interface GeneratedWaveEnemy {
  x: number;
  pattern: EnemyPattern;
  type: EnemyType;
  delay: number;
  speedMultiplier: number;
}

const LANES = [28, 56, 84, 112, 140, 168, 196];
const MIN_X = 24;
const MAX_X = 200;

export const generateWave = (
  difficulty: WaveDifficulty,
  wave: number,
  totalWaves: number,
): GeneratedWaveEnemy[] => {
  const unlockedEnemies = getUnlockedEnemies(wave, totalWaves);
  const types = generateEnemyTypes(
    difficulty,
    unlockedEnemies,
    wave,
    totalWaves,
  );

  const lanes = Phaser.Utils.Array.Shuffle([...LANES]);

  return types.map((type, index) => ({
    x: getSpawnX(lanes, index),
    pattern: getPattern(difficulty.zigzagChance),
    type,
    delay: index * difficulty.spawnInterval,
    speedMultiplier: difficulty.speedMultiplier,
  }));
};

const generateEnemyTypes = (
  difficulty: WaveDifficulty,
  unlockedEnemies: EnemyType[],
  wave: number,
  totalWaves: number,
): EnemyType[] => {
  const fixedCounts = getFixedEnemyCounts(wave, totalWaves);
  const fixedTypes = getFixedEnemyTypes(fixedCounts);

  const randomEnemies = unlockedEnemies.filter(
    (type) => fixedCounts[type] === undefined,
  );

  const randomCount = Math.max(
    0,
    difficulty.enemyCount - fixedTypes.length,
  );

  const types: EnemyType[] = [
    ...fixedTypes,
    ...Array.from(
      { length: randomCount },
      () => getEnemyType(difficulty, randomEnemies),
    ),
  ];

  ensureNewestUnlockedEnemy(types, unlockedEnemies, fixedCounts);
  ensureMinimumSpecials(types, difficulty, randomEnemies);

  return Phaser.Utils.Array.Shuffle(types);
};

const getFixedEnemyTypes = (
  fixedCounts: Partial<Record<EnemyType, number>>,
): EnemyType[] =>
  (Object.entries(fixedCounts) as [EnemyType, number][])
    .flatMap(([type, count]) =>
      Array.from({ length: count }, () => type),
    );

const getEnemyType = (
  difficulty: WaveDifficulty,
  unlockedEnemies: EnemyType[],
): EnemyType => {
  const weights = getSpecialWeights(difficulty, unlockedEnemies);
  const roll = Math.random();

  let threshold = 0;

  for (const { type, chance } of weights) {
    threshold += chance;

    if (roll < threshold) {
      return type;
    }
  }

  return "tomato";
};

const getSpecialWeights = (
  difficulty: WaveDifficulty,
  unlockedEnemies: EnemyType[],
) => {
  const weights: Array<{
    type: EnemyType;
    chance: number;
  }> = [];

  if (unlockedEnemies.includes("basil")) {
    weights.push({
      type: "basil",
      chance: difficulty.basilChance,
    });
  }

  if (unlockedEnemies.includes("grater")) {
    weights.push({
      type: "grater",
      chance: difficulty.graterChance,
    });
  }

  if (unlockedEnemies.includes("fork")) {
    weights.push({
      type: "fork",
      chance: difficulty.forkChance,
    });
  }

  return weights;
};

const getSpecialType = (
  difficulty: WaveDifficulty,
  unlockedEnemies: EnemyType[],
): EnemyType => {
  const weights = getSpecialWeights(difficulty, unlockedEnemies);

  const totalWeight = weights.reduce(
    (sum, item) => sum + item.chance,
    0,
  );

  if (weights.length === 0 || totalWeight <= 0) {
    return "tomato";
  }

  let roll = Math.random() * totalWeight;

  for (const { type, chance } of weights) {
    roll -= chance;

    if (roll <= 0) {
      return type;
    }
  }

  return weights[weights.length - 1]?.type ?? "tomato";
};

const ensureNewestUnlockedEnemy = (
  types: EnemyType[],
  unlockedEnemies: EnemyType[],
  fixedCounts: Partial<Record<EnemyType, number>>,
) => {
  const newestEnemy =
    unlockedEnemies[unlockedEnemies.length - 1];

  if (
    !newestEnemy ||
    fixedCounts[newestEnemy] !== undefined ||
    types.includes(newestEnemy)
  ) {
    return;
  }

  const tomatoIndex = types.indexOf("tomato");
  const replaceIndex = tomatoIndex >= 0 ? tomatoIndex : 0;

  types[replaceIndex] = newestEnemy;
};

const ensureMinimumSpecials = (
  types: EnemyType[],
  difficulty: WaveDifficulty,
  unlockedEnemies: EnemyType[],
) => {
  let specialCount = types.filter(
    (type) => type !== "tomato",
  ).length;

  while (specialCount < difficulty.minSpecials) {
    const tomatoIndex = types.indexOf("tomato");

    if (tomatoIndex === -1) return;

    const specialType = getSpecialType(
      difficulty,
      unlockedEnemies,
    );

    if (specialType === "tomato") return;

    types[tomatoIndex] = specialType;
    specialCount += 1;
  }
};

const getPattern = (zigzagChance: number): EnemyPattern =>
  Math.random() < zigzagChance ? "zigzag" : "straight";

const getSpawnX = (
  lanes: number[],
  index: number,
) => {
  const lane = lanes[index % lanes.length];

  const extraOffset =
    index < lanes.length
      ? 0
      : Phaser.Math.Between(-12, 12);

  return Phaser.Math.Clamp(
    lane + extraOffset,
    MIN_X,
    MAX_X,
  );
};