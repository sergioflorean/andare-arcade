import Phaser from "phaser";
import type { EnemyPattern } from "../types";

interface WaveEnemyConfig {
  x: number;
  pattern: EnemyPattern;
  delay: number;
}

interface WaveDefinition {
  enemies: WaveEnemyConfig[];
}

type SpawnEnemyCallback = (
  x: number,
  pattern: EnemyPattern,
) => void;

type WaveChangeCallback = (
  waveNumber: number,
) => void;

const WAVE_DELAY = 1500;

export class WaveManager {
  private scene: Phaser.Scene;

  private spawnEnemy: SpawnEnemyCallback;
  private onWaveChange: WaveChangeCallback;

  private currentWaveIndex = 0;
  private pendingSpawns = 0;
  private waitingForNextWave = false;

  private waves: WaveDefinition[] = [
    {
      enemies: [
        {
          x: 40,
          pattern: "straight",
          delay: 0,
        },
        {
          x: 76,
          pattern: "zigzag",
          delay: 450,
        },
        {
          x: 112,
          pattern: "straight",
          delay: 900,
        },
        {
          x: 148,
          pattern: "zigzag",
          delay: 1350,
        },
        {
          x: 184,
          pattern: "straight",
          delay: 1800,
        },
      ],
    },

    {
      enemies: [
        {
          x: 32,
          pattern: "zigzag",
          delay: 0,
        },
        {
          x: 64,
          pattern: "straight",
          delay: 300,
        },
        {
          x: 96,
          pattern: "zigzag",
          delay: 600,
        },
        {
          x: 128,
          pattern: "straight",
          delay: 900,
        },
        {
          x: 160,
          pattern: "zigzag",
          delay: 1200,
        },
        {
          x: 192,
          pattern: "straight",
          delay: 1500,
        },
      ],
    },

    {
      enemies: [
        {
          x: 40,
          pattern: "zigzag",
          delay: 0,
        },
        {
          x: 72,
          pattern: "zigzag",
          delay: 250,
        },
        {
          x: 104,
          pattern: "straight",
          delay: 500,
        },
        {
          x: 136,
          pattern: "straight",
          delay: 750,
        },
        {
          x: 168,
          pattern: "zigzag",
          delay: 1000,
        },
        {
          x: 200,
          pattern: "zigzag",
          delay: 1250,
        },
      ],
    },
  ];

  constructor(
    scene: Phaser.Scene,
    spawnEnemy: SpawnEnemyCallback,
    onWaveChange: WaveChangeCallback,
  ) {
    this.scene = scene;

    this.spawnEnemy = spawnEnemy;
    this.onWaveChange = onWaveChange;
  }

  start() {
    this.startCurrentWave();
  }

  update(activeEnemyCount: number) {
    const waveFinished =
      activeEnemyCount === 0 &&
      this.pendingSpawns === 0;

    if (
      waveFinished &&
      !this.waitingForNextWave
    ) {
      this.scheduleNextWave();
    }
  }

  private startCurrentWave() {
    const wave =
      this.waves[this.currentWaveIndex];

    if (!wave) {
      this.currentWaveIndex = 0;

      this.startCurrentWave();

      return;
    }

    const waveNumber =
      this.currentWaveIndex + 1;

    this.onWaveChange(waveNumber);

    this.pendingSpawns =
      wave.enemies.length;

    wave.enemies.forEach(
      (enemyConfig) => {
        this.scene.time.delayedCall(
          enemyConfig.delay,
          () => {
            this.spawnEnemy(
              enemyConfig.x,
              enemyConfig.pattern,
            );

            this.pendingSpawns -= 1;
          },
        );
      },
    );
  }

  private scheduleNextWave() {
    this.waitingForNextWave = true;

    this.scene.time.delayedCall(
      WAVE_DELAY,
      () => {
        this.currentWaveIndex += 1;

        if (
          this.currentWaveIndex >=
          this.waves.length
        ) {
          this.currentWaveIndex = 0;
        }

        this.waitingForNextWave = false;

        this.startCurrentWave();
      },
    );
  }
}