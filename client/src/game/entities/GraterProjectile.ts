import Phaser from "phaser";

const PROJECTILE_SPEED = 95;

export class GraterProjectile extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    targetX: number,
    targetY: number,
  ) {
    super(
      scene,
      x,
      y,
      "cheese-shard",
    );

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const angle = Phaser.Math.Angle.Between(
      x,
      y,
      targetX,
      targetY,
    );

    this.setVelocity(
      Math.cos(angle) * PROJECTILE_SPEED,
      Math.sin(angle) * PROJECTILE_SPEED,
    );

    this.setRotation(angle);
  }

  update() {
    const margin = 16;

    const outsideScreen =
      this.x < -margin ||
      this.x > this.scene.scale.width + margin ||
      this.y < -margin ||
      this.y > this.scene.scale.height + margin;

    if (outsideScreen) {
      this.destroy();
    }
  }
}