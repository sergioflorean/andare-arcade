import Phaser from "phaser";

const BOSS_PROJECTILE_SPEED = 90;

export class BossProjectile extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    super(
      scene,
      x,
      y,
      "boss-projectile",
    );

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setVelocityY(
      BOSS_PROJECTILE_SPEED,
    );
  }

  update() {
    if (
      this.y - this.height >
      this.scene.scale.height
    ) {
      this.destroy();
    }
  }
}