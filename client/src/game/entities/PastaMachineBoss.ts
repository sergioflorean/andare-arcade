import Phaser from "phaser";

import {
  PASTA_MACHINE_DAMAGED_TEXTURE,
  PASTA_MACHINE_TEXTURE,
} from "./createPastaMachineBossTexture";

const MAX_HEALTH = 18;

const NORMAL_HORIZONTAL_SPEED = 26;
const NORMAL_VERTICAL_SPEED = 14;

const ENRAGED_HORIZONTAL_SPEED = 40;
const ENRAGED_VERTICAL_SPEED = 22;

const LEFT_LIMIT = 38;
const RIGHT_LIMIT = 186;

const TOP_LIMIT = 42;
const BOTTOM_LIMIT = 92;

const NORMAL_ATTACK_COOLDOWN = 1250;
const ENRAGED_ATTACK_COOLDOWN = 800;

const TELEGRAPH_DURATION = 1200;
const ROLLER_RECOVERY = 900;

const NORMAL_TELEGRAPH_TINT = 0xffb347;
const ROLLER_TELEGRAPH_TINT = 0xff4d3d;
const HIT_TINT = 0xffe1cf;

const HIT_FLASH_DURATION = 70;

const NORMAL_DOUGH_SPEED = 95;
const ENRAGED_DOUGH_SPEED = 120;

type PastaMachineAttack =
  | "dough-strips"
  | "roller-lane";

type BossState =
  | "moving"
  | "telegraph";

type DoughStripCallback = (
  x: number,
  y: number,
  velocityX: number,
  velocityY: number,
) => void;

type RollerLaneCallback = (
  laneX: number,
) => void;

export class PastaMachineBoss extends Phaser.Physics.Arcade.Sprite {
  private health = MAX_HEALTH;

  private movementDirectionX: -1 | 1 = 1;
  private movementDirectionY: -1 | 1 = 1;

  private lastAttackTime = 0;
  private attackIndex = 0;

  private bossState: BossState = "moving";

  private telegraphEndsAt = 0;
  private pendingAttack?: PastaMachineAttack;

  private rollerTargetX = 112;
  private hasEnteredEnragedPhase = false;

  private attackPatterns: PastaMachineAttack[] = [
    "dough-strips",
    "roller-lane",
    "dough-strips",
    "roller-lane",
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
      PASTA_MACHINE_TEXTURE,
    );

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(2);
    this.setScale(1.05);

    this.setVelocity(
      NORMAL_HORIZONTAL_SPEED,
      NORMAL_VERTICAL_SPEED,
    );
  }

  update(
    time: number,
    targetX: number,
    onDoughStrip: DoughStripCallback,
    onRollerLane: RollerLaneCallback,
  ) {
    this.updateEnragedState();

    if (
      this.bossState === "telegraph"
    ) {
      this.updateTelegraph(
        time,
        onDoughStrip,
        onRollerLane,
      );

      return;
    }

    this.updateMovement();

    if (
      time - this.lastAttackTime <
      this.getAttackCooldown()
    ) {
      return;
    }

    this.startNextAttack(
      time,
      targetX,
    );
  }

  private updateMovement() {
    if (this.x >= RIGHT_LIMIT) {
      this.movementDirectionX = -1;
    }

    if (this.x <= LEFT_LIMIT) {
      this.movementDirectionX = 1;
    }

    if (this.y >= BOTTOM_LIMIT) {
      this.movementDirectionY = -1;
    }

    if (this.y <= TOP_LIMIT) {
      this.movementDirectionY = 1;
    }

    const horizontalSpeed =
      this.isEnraged()
        ? ENRAGED_HORIZONTAL_SPEED
        : NORMAL_HORIZONTAL_SPEED;

    const verticalSpeed =
      this.isEnraged()
        ? ENRAGED_VERTICAL_SPEED
        : NORMAL_VERTICAL_SPEED;

    this.setVelocity(
      this.movementDirectionX * horizontalSpeed,
      this.movementDirectionY * verticalSpeed,
    );
  }

  private startNextAttack(
    time: number,
    targetX: number,
  ) {
    const attack =
      this.attackPatterns[
        this.attackIndex
      ];

    if (!attack) return;

    this.attackIndex =
      (this.attackIndex + 1) %
      this.attackPatterns.length;

    this.pendingAttack = attack;
    this.bossState = "telegraph";

    this.telegraphEndsAt =
      time + TELEGRAPH_DURATION;

    this.lastAttackTime =
      attack === "roller-lane"
        ? time + ROLLER_RECOVERY
        : time;

    this.setVelocity(0, 0);

    if (
      attack === "roller-lane"
    ) {
      this.rollerTargetX =
        Phaser.Math.Clamp(
          targetX,
          24,
          this.scene.scale.width - 24,
        );

      this.setTint(
        ROLLER_TELEGRAPH_TINT,
      );
    } else {
      this.setTint(
        NORMAL_TELEGRAPH_TINT,
      );
    }

    this.scene.tweens.add({
      targets: this,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 80,
      yoyo: true,
      repeat: 2,
    });
  }

  private updateTelegraph(
    time: number,
    onDoughStrip: DoughStripCallback,
    onRollerLane: RollerLaneCallback,
  ) {
    this.setVelocity(0, 0);

    if (
      time <
      this.telegraphEndsAt
    ) {
      return;
    }

    this.scene.tweens.killTweensOf(
      this,
    );

    this.setScale(1.05);
    this.clearTint();

    if (
      this.pendingAttack ===
      "dough-strips"
    ) {
      this.fireDoughStrips(
        onDoughStrip,
      );
    }

    if (
      this.pendingAttack ===
      "roller-lane"
    ) {
      onRollerLane(
        this.rollerTargetX,
      );
    }

    this.pendingAttack = undefined;
    this.bossState = "moving";
  }

  private fireDoughStrips(
    callback: DoughStripCallback,
  ) {
    const startY =
      this.y + 28;

    const speed =
      this.isEnraged()
        ? ENRAGED_DOUGH_SPEED
        : NORMAL_DOUGH_SPEED;

    callback(
      this.x - 38,
      startY,
      -22,
      speed,
    );

    callback(
      this.x,
      startY + 2,
      0,
      speed + 5,
    );

    callback(
      this.x + 38,
      startY,
      22,
      speed,
    );

    if (
      this.isEnraged()
    ) {
      callback(
        this.x,
        startY - 5,
        0,
        speed + 18,
      );
    }
  }

  private updateEnragedState() {
    if (
      this.hasEnteredEnragedPhase ||
      !this.isEnraged()
    ) {
      return;
    }

    this.hasEnteredEnragedPhase = true;

    this.setTexture(
      PASTA_MACHINE_DAMAGED_TEXTURE,
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
      MAX_HEALTH / 2
    );
  }

  takeDamage(
    damage = 1,
  ) {
    this.health = Math.max(
      0,
      this.health - damage,
    );

    this.updateEnragedState();
    this.flashHit();

    return this.health === 0;
  }

  private flashHit() {
    this.setTint(
      HIT_TINT,
    );

    this.scene.time.delayedCall(
      HIT_FLASH_DURATION,
      () => {
        if (
          !this.active ||
          this.bossState ===
            "telegraph"
        ) {
          return;
        }

        this.clearTint();
      },
    );
  }

  getHealth() {
    return this.health;
  }

  getMaxHealth() {
    return MAX_HEALTH;
  }
}