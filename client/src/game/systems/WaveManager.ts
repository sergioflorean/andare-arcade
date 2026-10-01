import Phaser from "phaser";

import type {
  EnemyPattern,
  EnemyType,
} from "../types";

import {
  FINAL_WAVE_CLEAR_DELAY,
  NEXT_WAVE_DELAY,
  WAVES_PER_STAGE,
  WAVE_ADVANCE_TIMEOUT,
  getWaveDifficulty,
} from "./waveConfig";

import { generateWave } from "./WaveGenerator";

type SpawnEnemyCallback = (
  x: number,
  pattern: EnemyPattern,
  type: EnemyType,
  speedMultiplier: number,
) => void;

type WaveChangeCallback = (
  waveNumber: number,
) => void;

type WavesCompleteCallback = () => void;

export class WaveManager {
  private scene: Phaser.Scene;
  private stage: number;
  private spawnEnemy: SpawnEnemyCallback;
  private onWaveChange: WaveChangeCallback;
  private onWavesComplete: WavesCompleteCallback;

  private currentWave = 0;
  private pendingSpawns = 0;
  private clearDeadline = 0;

  private isWaveActive = false;
  private isWaitingForNextWave = false;
  private hasCompleted = false;

  constructor(
    scene: Phaser.Scene,
    stage: number,
    spawnEnemy: SpawnEnemyCallback,
    onWaveChange: WaveChangeCallback,
    onWavesComplete: WavesCompleteCallback,
  ) {
    this.scene = scene;
    this.stage = stage;
    this.spawnEnemy = spawnEnemy;
    this.onWaveChange = onWaveChange;
    this.onWavesComplete = onWavesComplete;
  }

  start() {
    this.startNextWave();
  }

  update(activeEnemies: number) {
    if (
      this.hasCompleted ||
      !this.isWaveActive ||
      this.isWaitingForNextWave ||
      this.pendingSpawns > 0
    ) {
      return;
    }

    const cleared = activeEnemies === 0;
    const isFinalWave =
      this.currentWave >= WAVES_PER_STAGE;

    if (isFinalWave) {
      if (cleared) {
        this.finishCurrentWave();
      }

      return;
    }

    if (!this.clearDeadline) {
      this.clearDeadline =
        this.scene.time.now +
        WAVE_ADVANCE_TIMEOUT;
    }

    if (
      cleared ||
      this.scene.time.now >= this.clearDeadline
    ) {
      this.finishCurrentWave();
    }
  }

  private startNextWave() {
    this.currentWave += 1;
    this.clearDeadline = 0;

    const difficulty = getWaveDifficulty(
      this.stage,
      this.currentWave,
    );

    const enemies = generateWave(
      difficulty,
      this.currentWave,
      WAVES_PER_STAGE,
    );

    this.isWaveActive = true;
    this.pendingSpawns = enemies.length;

    this.onWaveChange(this.currentWave);

    enemies.forEach((enemy) => {
      this.scene.time.delayedCall(
        enemy.delay,
        () => {
          this.spawnEnemy(
            enemy.x,
            enemy.pattern,
            enemy.type,
            enemy.speedMultiplier,
          );

          this.pendingSpawns -= 1;
        },
      );
    });
  }

  private finishCurrentWave() {
    this.isWaveActive = false;
    this.clearDeadline = 0;

    if (
      this.currentWave >=
      WAVES_PER_STAGE
    ) {
      this.isWaitingForNextWave = true;

      this.scene.time.delayedCall(
        FINAL_WAVE_CLEAR_DELAY,
        () => {
          this.isWaitingForNextWave = false;
          this.completeWaves();
        },
      );

      return;
    }

    this.isWaitingForNextWave = true;

    this.scene.time.delayedCall(
      NEXT_WAVE_DELAY,
      () => {
        this.isWaitingForNextWave = false;
        this.startNextWave();
      },
    );
  }

  private completeWaves() {
    if (this.hasCompleted) return;

    this.hasCompleted = true;
    this.isWaveActive = false;

    this.onWavesComplete();
  }
}