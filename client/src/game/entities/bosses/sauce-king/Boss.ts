import Phaser from "phaser";

import type {
  BossAttackPattern,
} from "../../../types";

const BOSS_SPEED = 30;
const ENRAGED_BOSS_SPEED = 44;

const BOSS_MAX_HEALTH = 12;

const LEFT_LIMIT = 34;
const RIGHT_LIMIT = 190;

const NORMAL_ATTACK_COOLDOWN = 950;
const ENRAGED_ATTACK_COOLDOWN = 550;

const STRAIGHT_SHOT_SPEED = 110;
const AIMED_SHOT_SPEED = 125;

const HIT_FLASH_DURATION = 70;

type BossAttackCallback = (
  x: number,
  y: number,
  velocityX: number,
  velocityY: number,
) => void;

export class Boss extends Phaser.Physics.Arcade.Sprite {
  private health = BOSS_MAX_HEALTH;

  private lastAttackTime = 0;
  private attackIndex = 0;
  private movementDirection = 1;

  private attackPatterns: BossAttackPattern[] = [
    "straight",
    "triple",
    "aimed",
    "triple",
  ];

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    super(
      scene,
      x,
      y,
      "boss",
    );

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(2);
    this.setVelocityX(BOSS_SPEED);
  }

  update(
    time: number,
    targetX: number,
    targetY: number,
    attackCallback: BossAttackCallback,
  ) {
    this.updateMovement();

    if (
      time - this.lastAttackTime <
      this.getAttackCooldown()
    ) {
      return;
    }

    this.lastAttackTime = time;

    const pattern =
      this.attackPatterns[this.attackIndex];

    if (!pattern) return;

    this.performAttack(
      pattern,
      targetX,
      targetY,
      attackCallback,
    );

    this.attackIndex =
      (this.attackIndex + 1) %
      this.attackPatterns.length;
  }

  private updateMovement() {
    if (this.x >= RIGHT_LIMIT) {
      this.movementDirection = -1;
    }

    if (this.x <= LEFT_LIMIT) {
      this.movementDirection = 1;
    }

    const speed = this.isEnraged()
      ? ENRAGED_BOSS_SPEED
      : BOSS_SPEED;

    this.setVelocityX(
      this.movementDirection * speed,
    );
  }

  private performAttack(
    pattern: BossAttackPattern,
    targetX: number,
    targetY: number,
    attackCallback: BossAttackCallback,
  ) {
    const shotX = this.x;
    const shotY = this.y + 21;

    if (pattern === "straight") {
      attackCallback(
        shotX,
        shotY,
        0,
        STRAIGHT_SHOT_SPEED,
      );

      return;
    }

    if (pattern === "triple") {
      attackCallback(
        shotX - 8,
        shotY,
        -58,
        100,
      );

      attackCallback(
        shotX,
        shotY + 2,
        0,
        115,
      );

      attackCallback(
        shotX + 8,
        shotY,
        58,
        100,
      );

      return;
    }

    this.fireAimedShot(
      shotX,
      shotY,
      targetX,
      targetY,
      attackCallback,
    );
  }

  private fireAimedShot(
    startX: number,
    startY: number,
    targetX: number,
    targetY: number,
    attackCallback: BossAttackCallback,
  ) {
    const directionX =
      targetX - startX;

    const directionY =
      targetY - startY;

    const distance = Math.hypot(
      directionX,
      directionY,
    );

    if (distance === 0) return;

    attackCallback(
      startX,
      startY,
      (
        directionX /
        distance
      ) * AIMED_SHOT_SPEED,
      (
        directionY /
        distance
      ) * AIMED_SHOT_SPEED,
    );
  }

  private getAttackCooldown() {
    return this.isEnraged()
      ? ENRAGED_ATTACK_COOLDOWN
      : NORMAL_ATTACK_COOLDOWN;
  }

  private isEnraged() {
    return (
      this.health <=
      BOSS_MAX_HEALTH / 2
    );
  }

  takeDamage(
    damage = 1,
  ) {
    this.health = Math.max(
      0,
      this.health - damage,
    );

    this.flashHit();

    return this.health === 0;
  }

  private flashHit() {
    this.setTint(
      0xffd8c8,
    );

    this.scene.time.delayedCall(
      HIT_FLASH_DURATION,
      () => {
        if (this.active) {
          this.clearTint();
        }
      },
    );
  }

  getHealth() {
    return this.health;
  }

  getMaxHealth() {
    return BOSS_MAX_HEALTH;
  }
}