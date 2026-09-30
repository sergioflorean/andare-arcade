import Phaser from "phaser";
import type { BossAttackPattern } from "../types";

const BOSS_SPEED = 35;
const BOSS_MAX_HEALTH = 4;

const LEFT_LIMIT = 32;
const RIGHT_LIMIT = 192;

const NORMAL_ATTACK_COOLDOWN = 1000;
const ENRAGED_ATTACK_COOLDOWN = 650;

const STRAIGHT_SHOT_SPEED = 105;
const AIMED_SHOT_SPEED = 115;

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

  private attackPatterns: BossAttackPattern[] = [
    "straight",
    "triple",
    "aimed",
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

    this.setVelocityX(
      BOSS_SPEED,
    );
  }

  update(
    time: number,
    targetX: number,
    targetY: number,
    attackCallback: BossAttackCallback,
  ) {
    this.updateMovement();

    const attackCooldown =
      this.getAttackCooldown();

    const canAttack =
      time - this.lastAttackTime >=
      attackCooldown;

    if (!canAttack) {
      return;
    }

    this.lastAttackTime = time;

    const pattern =
      this.attackPatterns[
        this.attackIndex
      ];

    if (!pattern) {
      return;
    }

    this.performAttack(
      pattern,
      targetX,
      targetY,
      attackCallback,
    );

    this.attackIndex =
      (
        this.attackIndex + 1
      ) %
      this.attackPatterns.length;
  }

  private updateMovement() {
    if (
      this.x >= RIGHT_LIMIT
    ) {
      this.setVelocityX(
        -BOSS_SPEED,
      );
    }

    if (
      this.x <= LEFT_LIMIT
    ) {
      this.setVelocityX(
        BOSS_SPEED,
      );
    }
  }

  private performAttack(
    pattern: BossAttackPattern,
    targetX: number,
    targetY: number,
    attackCallback: BossAttackCallback,
  ) {
    const shotX = this.x;
    const shotY = this.y + 20;

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
        shotX,
        shotY,
        -55,
        95,
      );

      attackCallback(
        shotX,
        shotY,
        0,
        105,
      );

      attackCallback(
        shotX,
        shotY,
        55,
        95,
      );

      return;
    }

    if (pattern === "aimed") {
      this.fireAimedShot(
        shotX,
        shotY,
        targetX,
        targetY,
        attackCallback,
      );
    }
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

    const distance =
      Math.sqrt(
        directionX * directionX +
        directionY * directionY,
      );

    if (distance === 0) {
      return;
    }

    const velocityX =
      (
        directionX /
        distance
      ) *
      AIMED_SHOT_SPEED;

    const velocityY =
      (
        directionY /
        distance
      ) *
      AIMED_SHOT_SPEED;

    attackCallback(
      startX,
      startY,
      velocityX,
      velocityY,
    );
  }

  private getAttackCooldown() {
    const isEnraged =
      this.health <=
      BOSS_MAX_HEALTH / 2;

    if (isEnraged) {
      return ENRAGED_ATTACK_COOLDOWN;
    }

    return NORMAL_ATTACK_COOLDOWN;
  }

  takeDamage(
  damage = 1,
) {
  this.health -= damage;

  if (this.health <= 0) {
    this.health = 0;

    return true;
  }

  return false;
}

  getHealth() {
    return this.health;
  }

  getMaxHealth() {
    return BOSS_MAX_HEALTH;
  }
}