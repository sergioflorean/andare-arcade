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

const MAX_HEALTH: Record<EnemyType, number> = {
  tomato: 1,
  fork: 1,
  grater: 3,
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

const GRATER_SCALE = 1.45;
const GRATER_HORIZONTAL_SPEED = 70;
const GRATER_ROAM_SPEED = 26;

const GRATER_RETREAT_SPEED = 75;
const GRATER_RETREAT_DURATION = 550;
const GRATER_RETREAT_MIN_DELAY = 700;
const GRATER_RETREAT_MAX_DELAY = 1300;
const GRATER_MAX_RETREATS = 2;

const GRATER_MIN_X = 22;
const GRATER_MAX_X = 202;

const GRATER_DAMAGED_TINT = 0xc2ad8a;
const GRATER_SMOKE_COLOR = 0x777777;

type ForkState =
  | "approach"
  | "telegraph"
  | "dive";

type GraterState =
  | "approach"
  | "telegraph"
  | "roam"
  | "retreat";

type GraterShootCallback = (
  x: number,
  y: number,
  targetX: number,
  targetY: number,
) => void;

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private pattern: EnemyPattern;
  private enemyType: EnemyType;

  private health: number;
  private speedMultiplier: number;
  private zigzagPhase: number;

  private forkState: ForkState = "approach";
  private forkDiveTime = 0;

  private graterState: GraterState = "approach";
  private graterShootTime = 0;
  private graterRetreatAt = 0;
  private graterRetreatEndsAt = 0;
  private graterRetreats = 0;

  private isGraterDamaged = false;
  private isCriticalBlinking = false;
  private graterDamageSmoke?: Phaser.GameObjects.Graphics;

  private targetX = 0;
  private targetY = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    pattern: EnemyPattern = "straight",
    type: EnemyType = "tomato",
    speedMultiplier = 1,
  ) {
    super(scene, x, y, TEXTURE_KEYS[type]);

    this.pattern = pattern;
    this.enemyType = type;
    this.health = MAX_HEALTH[type];
    this.speedMultiplier = speedMultiplier;
    this.zigzagPhase = Phaser.Math.FloatBetween(0, Math.PI * 2);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (type === "grater") this.setScale(GRATER_SCALE);

    this.once("destroy", () => {
      this.scene.tweens.killTweensOf(this);
      this.graterDamageSmoke?.destroy();
      this.graterDamageSmoke = undefined;
    });

    this.setVelocityY(
      VERTICAL_SPEEDS[type] * speedMultiplier,
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
      this.updateFork(time, playerX, playerY);
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

    this.updateDamageVisual();

    if (this.y - this.height > this.scene.scale.height) {
      this.destroy();
    }
  }

  takeDamage(damage = 1) {
    this.health -= damage;

    if (this.health <= 0) {
      this.destroy();
      return true;
    }

    if (this.enemyType === "grater") {
      this.applyGraterDamagedState();

      if (this.health === 1) {
        this.startCriticalBlink();
      }
    }

    return false;
  }

  private updateNormalMovement(time: number) {
    this.setVelocityY(
      VERTICAL_SPEEDS[this.enemyType] *
        this.speedMultiplier,
    );

    if (this.pattern === "straight") {
      this.setVelocityX(0);
      return;
    }

    const direction = Math.sin(
      time / 250 + this.zigzagPhase,
    );

    this.setVelocityX(
      direction *
        ZIGZAG_SPEEDS[this.enemyType] *
        this.speedMultiplier,
    );
  }

  private updateFork(
    time: number,
    playerX: number,
    playerY: number,
  ) {
    if (this.forkState === "approach") {
      this.updateNormalMovement(time);

      if (this.y < FORK_DIVE_TRIGGER_Y) return;

      this.targetX = playerX;
      this.targetY = playerY;

      this.forkState = "telegraph";
      this.forkDiveTime =
        time + FORK_TELEGRAPH_DURATION;

      this.setVelocity(0, 0);
      this.setTint(0xf2cf66);

      return;
    }

    if (
      this.forkState !== "telegraph" ||
      time < this.forkDiveTime
    ) {
      return;
    }

    this.clearTint();

    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.targetX,
      this.targetY,
    );

    this.setVelocity(
      Math.cos(angle) *
        FORK_DIVE_SPEED *
        this.speedMultiplier,
      Math.sin(angle) *
        FORK_DIVE_SPEED *
        this.speedMultiplier,
    );

    this.forkState = "dive";
  }

  private updateGrater(
    time: number,
    playerX: number,
    playerY: number,
    onShoot: GraterShootCallback,
  ) {
    if (this.graterState === "approach") {
      this.updateGraterMovement(
        time,
        VERTICAL_SPEEDS.grater,
      );

      if (this.y < GRATER_ATTACK_TRIGGER_Y) return;

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

      if (this.isGraterDamaged) {
        this.setTint(GRATER_DAMAGED_TINT);
      }

      onShoot(
        this.x,
        this.y + 8,
        this.targetX,
        this.targetY,
      );

      this.graterState = "roam";
      this.scheduleGraterRetreat(time);

      return;
    }

    if (this.graterState === "retreat") {
      this.updateGraterRetreat(time);
      return;
    }

    this.updateGraterMovement(
      time,
      GRATER_ROAM_SPEED,
    );

    if (
      this.graterRetreats < GRATER_MAX_RETREATS &&
      time >= this.graterRetreatAt
    ) {
      this.startGraterRetreat(time);
    }
  }

  private updateGraterMovement(
    time: number,
    verticalSpeed: number,
  ) {
    const velocityX =
      this.getGraterHorizontalVelocity(time);

    this.setVelocity(
      velocityX,
      verticalSpeed * this.speedMultiplier,
    );
  }

  private updateGraterRetreat(time: number) {
    const velocityX =
      this.getGraterHorizontalVelocity(time);

    this.setVelocity(
      velocityX,
      -GRATER_RETREAT_SPEED *
        this.speedMultiplier,
    );

    if (time < this.graterRetreatEndsAt) return;

    this.graterState = "roam";

    if (
      this.graterRetreats <
      GRATER_MAX_RETREATS
    ) {
      this.scheduleGraterRetreat(time);
    }
  }

  private startGraterRetreat(time: number) {
    this.graterRetreats += 1;
    this.graterState = "retreat";
    this.graterRetreatEndsAt =
      time + GRATER_RETREAT_DURATION;
  }

  private scheduleGraterRetreat(time: number) {
    this.graterRetreatAt =
      time +
      Phaser.Math.Between(
        GRATER_RETREAT_MIN_DELAY,
        GRATER_RETREAT_MAX_DELAY,
      );
  }

  private getGraterHorizontalVelocity(
    time: number,
  ) {
    let velocityX =
      Math.sin(
        time / 320 + this.zigzagPhase,
      ) *
      GRATER_HORIZONTAL_SPEED *
      this.speedMultiplier;

    if (this.x <= GRATER_MIN_X && velocityX < 0) {
      velocityX = Math.abs(velocityX);
    }

    if (this.x >= GRATER_MAX_X && velocityX > 0) {
      velocityX = -Math.abs(velocityX);
    }

    return velocityX;
  }

  private applyGraterDamagedState() {
    this.isGraterDamaged = true;
    this.setAngle(8);

    if (this.graterState !== "telegraph") {
      this.setTint(GRATER_DAMAGED_TINT);
    }

    if (this.graterDamageSmoke) return;

    this.graterDamageSmoke =
      this.scene.add.graphics();

    this.graterDamageSmoke.fillStyle(
      GRATER_SMOKE_COLOR,
      0.9,
    );

    this.graterDamageSmoke.fillRect(0, 0, 3, 3);
    this.graterDamageSmoke.fillRect(4, -5, 3, 3);
    this.graterDamageSmoke.fillRect(1, -9, 2, 2);

    this.graterDamageSmoke.setDepth(
      this.depth + 1,
    );
  }

  private updateDamageVisual() {
    this.graterDamageSmoke?.setPosition(
      this.x + 5,
      this.y - 10,
    );
  }

  private startCriticalBlink() {
    if (this.isCriticalBlinking) return;

    this.isCriticalBlinking = true;

    this.scene.tweens.add({
      targets: this,
      alpha: 0.25,
      duration: 120,
      yoyo: true,
      repeat: -1,
    });
  }
}