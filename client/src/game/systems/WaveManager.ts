import Phaser from "phaser";

import type {
  EnemyPattern,
  EnemyType,
} from "../types";

interface WaveEnemy {
  x: number;
  pattern: EnemyPattern;
  type: EnemyType;
  delay: number;
}

type Wave = WaveEnemy[];

type SpawnEnemyCallback = (
  x: number,
  pattern: EnemyPattern,
  type: EnemyType,
) => void;

type WaveChangeCallback = (
  waveNumber: number,
) => void;

type WavesCompleteCallback = () => void;

const WAVE_DELAY = 500;

const STAGE_ONE_WAVES: Wave[] = [
  [
    {
      x: 40,
      pattern: "straight",
      type: "tomato",
      delay: 0,
    },
    {
      x: 76,
      pattern: "zigzag",
      type: "tomato",
      delay: 450,
    },
    {
      x: 112,
      pattern: "straight",
      type: "tomato",
      delay: 900,
    },
    {
      x: 148,
      pattern: "zigzag",
      type: "tomato",
      delay: 1350,
    },
    {
      x: 184,
      pattern: "straight",
      type: "tomato",
      delay: 1800,
    },
  ],

  [
    {
      x: 32,
      pattern: "zigzag",
      type: "tomato",
      delay: 0,
    },
    {
      x: 64,
      pattern: "straight",
      type: "fork",
      delay: 300,
    },
    {
      x: 96,
      pattern: "zigzag",
      type: "tomato",
      delay: 600,
    },
    {
      x: 128,
      pattern: "straight",
      type: "fork",
      delay: 900,
    },
    {
      x: 160,
      pattern: "zigzag",
      type: "tomato",
      delay: 1200,
    },
    {
      x: 192,
      pattern: "straight",
      type: "fork",
      delay: 1500,
    },
  ],

  [
    {
      x: 40,
      pattern: "zigzag",
      type: "grater",
      delay: 0,
    },
    {
      x: 72,
      pattern: "zigzag",
      type: "tomato",
      delay: 250,
    },
    {
      x: 104,
      pattern: "straight",
      type: "fork",
      delay: 500,
    },
    {
      x: 136,
      pattern: "straight",
      type: "tomato",
      delay: 750,
    },
    {
      x: 168,
      pattern: "zigzag",
      type: "grater",
      delay: 1000,
    },
    {
      x: 200,
      pattern: "straight",
      type: "fork",
      delay: 1250,
    },
  ],
];

const STAGE_TWO_WAVES: Wave[] = [
  [
    {
      x: 28,
      pattern: "zigzag",
      type: "grater",
      delay: 0,
    },
    {
      x: 60,
      pattern: "zigzag",
      type: "tomato",
      delay: 250,
    },
    {
      x: 92,
      pattern: "straight",
      type: "fork",
      delay: 500,
    },
    {
      x: 124,
      pattern: "zigzag",
      type: "grater",
      delay: 750,
    },
    {
      x: 156,
      pattern: "straight",
      type: "fork",
      delay: 1000,
    },
    {
      x: 188,
      pattern: "zigzag",
      type: "tomato",
      delay: 1250,
    },
  ],

  [
    {
      x: 32,
      pattern: "zigzag",
      type: "grater",
      delay: 0,
    },
    {
      x: 58,
      pattern: "straight",
      type: "fork",
      delay: 200,
    },
    {
      x: 84,
      pattern: "zigzag",
      type: "tomato",
      delay: 400,
    },
    {
      x: 110,
      pattern: "zigzag",
      type: "grater",
      delay: 600,
    },
    {
      x: 136,
      pattern: "straight",
      type: "fork",
      delay: 800,
    },
    {
      x: 162,
      pattern: "zigzag",
      type: "tomato",
      delay: 1000,
    },
    {
      x: 188,
      pattern: "zigzag",
      type: "grater",
      delay: 1200,
    },
  ],

  [
    {
      x: 24,
      pattern: "zigzag",
      type: "grater",
      delay: 0,
    },
    {
      x: 52,
      pattern: "zigzag",
      type: "grater",
      delay: 180,
    },
    {
      x: 80,
      pattern: "straight",
      type: "fork",
      delay: 360,
    },
    {
      x: 108,
      pattern: "zigzag",
      type: "tomato",
      delay: 540,
    },
    {
      x: 136,
      pattern: "straight",
      type: "fork",
      delay: 720,
    },
    {
      x: 164,
      pattern: "zigzag",
      type: "grater",
      delay: 900,
    },
    {
      x: 192,
      pattern: "zigzag",
      type: "tomato",
      delay: 1080,
    },
  ],
];

export class WaveManager {
  private scene: Phaser.Scene;

  private waves: Wave[];

  private spawnEnemy:
    SpawnEnemyCallback;

  private onWaveChange:
    WaveChangeCallback;

  private onWavesComplete:
    WavesCompleteCallback;

  private currentWaveIndex = -1;

  private pendingSpawns = 0;

  private isWaveActive = false;
  private isWaitingForNextWave = false;
  private hasCompleted = false;

  constructor(
    scene: Phaser.Scene,
    stage: number,
    spawnEnemy:
      SpawnEnemyCallback,
    onWaveChange:
      WaveChangeCallback,
    onWavesComplete:
      WavesCompleteCallback,
  ) {
    this.scene = scene;

    this.waves =
      this.getWavesForStage(stage);

    this.spawnEnemy =
      spawnEnemy;

    this.onWaveChange =
      onWaveChange;

    this.onWavesComplete =
      onWavesComplete;
  }

  start() {
    this.startNextWave();
  }

  update(
    activeEnemies: number,
  ) {
    if (
      this.hasCompleted ||
      !this.isWaveActive ||
      this.isWaitingForNextWave
    ) {
      return;
    }

    if (
      this.pendingSpawns > 0
    ) {
      return;
    }

    if (
      activeEnemies > 0
    ) {
      return;
    }

    this.isWaveActive = false;

    this.isWaitingForNextWave =
      true;

    this.scene.time.delayedCall(
      WAVE_DELAY,
      () => {
        this.isWaitingForNextWave =
          false;

        this.startNextWave();
      },
    );
  }

  private startNextWave() {
    this.currentWaveIndex += 1;

    if (
      this.currentWaveIndex >=
      this.waves.length
    ) {
      this.completeWaves();

      return;
    }

    const wave =
      this.waves[
        this.currentWaveIndex
      ];

    this.isWaveActive = true;

    this.pendingSpawns =
      wave.length;

    this.onWaveChange(
      this.currentWaveIndex + 1,
    );

    wave.forEach(
      (enemy) => {
        this.scene.time.delayedCall(
          enemy.delay,
          () => {
            this.spawnEnemy(
              enemy.x,
              enemy.pattern,
              enemy.type,
            );

            this.pendingSpawns -= 1;
          },
        );
      },
    );
  }

  private completeWaves() {
    if (
      this.hasCompleted
    ) {
      return;
    }

    this.hasCompleted = true;
    this.isWaveActive = false;

    this.onWavesComplete();
  }

  private getWavesForStage(
    stage: number,
  ): Wave[] {
    if (
      stage === 2
    ) {
      return STAGE_TWO_WAVES;
    }

    return STAGE_ONE_WAVES;
  }
}