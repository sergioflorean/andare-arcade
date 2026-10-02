export interface WaveDifficulty {
  enemyCount: number;
  spawnInterval: number;
  speedMultiplier: number;
  forkChance: number;
  graterChance: number;
  basilChance: number;
  zigzagChance: number;
  minSpecials: number;
}

export const WAVES_PER_STAGE = 5;

export const NEXT_WAVE_DELAY = 250;
export const WAVE_ADVANCE_TIMEOUT = 1200;
export const FINAL_WAVE_CLEAR_DELAY = 800;

const WAVE_DIFFICULTY = {
  enemyCount: [5, 9],
  spawnInterval: [400, 220],
  speedMultiplier: [1, 1.3],
  forkChance: [0.1, 0.26],
  graterChance: [0, 0.16],
  basilChance: [0.45, 0.6],
  zigzagChance: [0.25, 0.45],
  minSpecials: [1, 3],
} as const;

const lerp = (start: number, end: number, progress: number) =>
  start + (end - start) * progress;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getWaveProgress = (wave: number) => {
  if (WAVES_PER_STAGE <= 1) return 1;
  return clamp((wave - 1) / (WAVES_PER_STAGE - 1), 0, 1);
};

export const getWaveDifficulty = (
  stage: number,
  wave: number,
): WaveDifficulty => {
  const stageLevel = Math.max(0, stage - 1);
  const progress = getWaveProgress(wave);

  return {
    enemyCount:
      Math.round(
        lerp(
          WAVE_DIFFICULTY.enemyCount[0],
          WAVE_DIFFICULTY.enemyCount[1],
          progress,
        ),
      ) + stageLevel * 2,

    spawnInterval: Math.max(
      160,
      Math.round(
        lerp(
          WAVE_DIFFICULTY.spawnInterval[0],
          WAVE_DIFFICULTY.spawnInterval[1],
          progress,
        ) - stageLevel * 80,
      ),
    ),

    speedMultiplier: Number(
      (
        lerp(
          WAVE_DIFFICULTY.speedMultiplier[0],
          WAVE_DIFFICULTY.speedMultiplier[1],
          progress,
        ) + stageLevel * 0.2
      ).toFixed(2),
    ),

    forkChance: Math.min(
      0.35,
      lerp(
        WAVE_DIFFICULTY.forkChance[0],
        WAVE_DIFFICULTY.forkChance[1],
        progress,
      ) + stageLevel * 0.05,
    ),

    graterChance: Math.min(
      0.28,
      lerp(
        WAVE_DIFFICULTY.graterChance[0],
        WAVE_DIFFICULTY.graterChance[1],
        progress,
      ) + stageLevel * 0.08,
    ),

    basilChance: Math.min(
  0.65,
  lerp(
    WAVE_DIFFICULTY.basilChance[0],
    WAVE_DIFFICULTY.basilChance[1],
    progress,
  ) + stageLevel * 0.03,
),

    zigzagChance: Math.min(
      0.6,
      lerp(
        WAVE_DIFFICULTY.zigzagChance[0],
        WAVE_DIFFICULTY.zigzagChance[1],
        progress,
      ) + stageLevel * 0.08,
    ),

    minSpecials:
      Math.round(
        lerp(
          WAVE_DIFFICULTY.minSpecials[0],
          WAVE_DIFFICULTY.minSpecials[1],
          progress,
        ),
      ) + stageLevel,
  };
};