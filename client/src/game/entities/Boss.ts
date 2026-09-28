import Phaser from "phaser";

const BOSS_SPEED = 35;
const BOSS_MAX_HEALTH = 20;

const LEFT_LIMIT = 32;
const RIGHT_LIMIT = 192;

const ATTACK_COOLDOWN = 900;

export class Boss extends Phaser.Physics.Arcade.Sprite {
  private health =
    BOSS_MAX_HEALTH;

  private lastAttackTime = 0;

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
    attackCallback: (
      x: number,
      y: number,
    ) => void,
  ) {
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

    const canAttack =
      time - this.lastAttackTime >=
      ATTACK_COOLDOWN;

    if (canAttack) {
      this.lastAttackTime = time;

      attackCallback(
        this.x,
        this.y + 20,
      );
    }
  }

  takeDamage(
    amount: number = 1,
  ) {
    this.health -= amount;

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