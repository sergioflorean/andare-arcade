import Phaser from "phaser";

import {
  DOUGH_STRIP_TEXTURE,
} from "./createDoughStripTexture";

const OFFSCREEN_MARGIN = 30;

export class DoughStripProjectile
  extends Phaser.Physics.Arcade.Sprite {
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
      DOUGH_STRIP_TEXTURE,
    );

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(3);

    this.setVelocity(
      velocityX,
      velocityY,
    );
  }

  update() {
    if (
      this.y >
        this.scene.scale.height +
          OFFSCREEN_MARGIN ||
      this.x < -OFFSCREEN_MARGIN ||
      this.x >
        this.scene.scale.width +
          OFFSCREEN_MARGIN
    ) {
      this.destroy();
    }
  }
}