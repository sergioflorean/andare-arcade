import Phaser from "phaser";

export class ColanderProjectile extends Phaser.Physics.Arcade.Sprite {
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
      "colander-drop",
    );

    scene.add.existing(
      this,
    );

    scene.physics.add.existing(
      this,
    );

    this.setVelocity(
      velocityX,
      velocityY,
    );

    this.setRotation(
      Math.atan2(
        velocityY,
        velocityX,
      ) +
        Math.PI / 2,
    );
  }

  update() {
    const margin = 16;

    const outsideScreen =
      this.x < -margin ||
      this.x >
        this.scene.scale.width +
          margin ||
      this.y < -margin ||
      this.y >
        this.scene.scale.height +
          margin;

    if (
      outsideScreen
    ) {
      this.destroy();
    }
  }
}