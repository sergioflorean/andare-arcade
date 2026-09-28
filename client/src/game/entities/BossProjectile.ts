import Phaser from "phaser";

export class BossProjectile extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
  ) {
    super(
      scene,
      x,
      y,
      "boss-projectile",
    );

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setVelocity(
      velocityX,
      velocityY,
    );
  }

  update() {
    const margin = 12;

    const isOutsideScreen =
      this.y > this.scene.scale.height + margin ||
      this.y < -margin ||
      this.x < -margin ||
      this.x > this.scene.scale.width + margin;

    if (isOutsideScreen) {
      this.destroy();
    }
  }
}