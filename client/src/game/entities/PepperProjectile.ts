import Phaser from "phaser";

const PEPPER_PROJECTILE_SPEED = 210;

export class PepperProjectile extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    velocityX: number,
    velocityY: number = PEPPER_PROJECTILE_SPEED,
  ) {
    super(scene, x, y, "pepper-projectile");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(1.2);
    this.setDepth(8);

    this.setVelocity(
      velocityX,
      velocityY,
    );
  }

  update() {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;

    const outOfBounds =
      this.y > height + 16 ||
      this.x < -16 ||
      this.x > width + 16;

    if (outOfBounds) {
      this.destroy();
    }
  }
}