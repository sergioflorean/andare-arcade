import Phaser from "phaser";

const PROJECTILE_SPEED = 180;

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    super(
      scene,
      x,
      y,
      "spaghetti-shot",
    );

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setVelocityY(-PROJECTILE_SPEED);
  }

  update() {
    if (this.y + this.height < 0) {
      this.destroy();
    }
  }
}