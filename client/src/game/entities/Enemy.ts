import Phaser from "phaser";

import type {
  EnemyPattern,
  EnemyType,
} from "../types";

const TEXTURE_KEYS: Record<EnemyType, string> = {
  tomato: "tomato-enemy",
  fork: "fork-enemy",
  grater: "grater-enemy",
};

const VERTICAL_SPEEDS: Record<EnemyType, number> = {
  tomato: 40,
  fork: 65,
  grater: 45,
};

const ZIGZAG_SPEEDS: Record<EnemyType, number> = {
  tomato: 55,
  fork: 45,
  grater: 85,
};

const FORK_DIVE_TRIGGER_Y = 70;
const FORK_TELEGRAPH_DURATION = 350;
const FORK_DIVE_SPEED = 180;

const GRATER_ATTACK_TRIGGER_Y = 75;
const GRATER_TELEGRAPH_DURATION = 450;

type ForkState =
  | "approach"
  | "telegraph"
  | "dive";

type GraterState =
  | "approach"
  | "telegraph"
  | "fired";

type GraterShootCallback = (
  x: number,
  y: number,
  targetX: number,
  targetY: number,
) => void;

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private pattern: EnemyPattern;
  private enemyType: EnemyType;

  private forkState: ForkState = "approach";
  private forkDiveTime = 0;

  private graterState: GraterState = "approach";
  private graterShootTime = 0;

  private targetX = 0;
  private targetY = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    pattern: EnemyPattern = "straight",
    type: EnemyType = "tomato",
  ) {
    super(
      scene,
      x,
      y,
      TEXTURE_KEYS[type],
    );

    this.pattern = pattern;
    this.enemyType = type;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setVelocityY(
      VERTICAL_SPEEDS[this.enemyType],
    );
  }

  update(
    time: number,
    playerX?: number,
    playerY?: number,
    onGraterShoot?: GraterShootCallback,
  ) {
    if (
      this.enemyType === "fork" &&
      playerX !== undefined &&
      playerY !== undefined
    ) {
      this.updateFork(
        time,
        playerX,
        playerY,
      );
    } else if (
      this.enemyType === "grater" &&
      playerX !== undefined &&
      playerY !== undefined &&
      onGraterShoot
    ) {
      this.updateGrater(
        time,
        playerX,
        playerY,
        onGraterShoot,
      );
    } else {
      this.updateNormalMovement(time);
    }

    if (
      this.y - this.height >
      this.scene.scale.height
    ) {
      this.destroy();
    }
  }

  private updateNormalMovement(time: number) {
    this.setVelocityY(
      VERTICAL_SPEEDS[this.enemyType],
    );

    if (this.pattern === "straight") {
      this.setVelocityX(0);
      return;
    }

    const direction =
      Math.sin(time / 250);

    this.setVelocityX(
      direction *
        ZIGZAG_SPEEDS[this.enemyType],
    );
  }

  private updateFork(
    time: number,
    playerX: number,
    playerY: number,
  ) {
    if (this.forkState === "approach") {
      this.updateNormalMovement(time);

      if (this.y < FORK_DIVE_TRIGGER_Y) {
        return;
      }

      this.targetX = playerX;
      this.targetY = playerY;

      this.forkState = "telegraph";
      this.forkDiveTime =
        time + FORK_TELEGRAPH_DURATION;

      this.setVelocity(0, 0);
      this.setTint(0xf2cf66);

      return;
    }

    if (this.forkState === "telegraph") {
      if (time < this.forkDiveTime) return;

      this.clearTint();

      const angle =
        Phaser.Math.Angle.Between(
          this.x,
          this.y,
          this.targetX,
          this.targetY,
        );

      this.setVelocity(
        Math.cos(angle) * FORK_DIVE_SPEED,
        Math.sin(angle) * FORK_DIVE_SPEED,
      );

      this.forkState = "dive";
    }
  }

  private updateGrater(
    time: number,
    playerX: number,
    playerY: number,
    onShoot: GraterShootCallback,
  ) {
    if (this.graterState === "approach") {
      this.updateNormalMovement(time);

      if (this.y < GRATER_ATTACK_TRIGGER_Y) {
        return;
      }

      this.targetX = playerX;
      this.targetY = playerY;

      this.graterState = "telegraph";
      this.graterShootTime =
        time + GRATER_TELEGRAPH_DURATION;

      this.setVelocity(0, 0);
      this.setTint(0xe84a32);

      return;
    }

    if (this.graterState === "telegraph") {
      if (time < this.graterShootTime) return;

      this.clearTint();

      onShoot(
        this.x,
        this.y + 8,
        this.targetX,
        this.targetY,
      );

      this.graterState = "fired";

      return;
    }

    this.updateNormalMovement(time);
  }
}