import Phaser from "phaser";

import {
  ROLLING_PIN_TRAIL_TEXTURE,
} from "./createRollingPinTrailTexture";

const TRAIL_LIFETIME = 1000;

export class RollingPinTrailHazard
  extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    y: number,
  ) {
    super(
      scene,
      scene.scale.width / 2,
      y,
      ROLLING_PIN_TRAIL_TEXTURE,
    );

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(3);
    this.setAlpha(0.8);

    const body =
      this.body as Phaser.Physics.Arcade.Body;

    body.setAllowGravity(false);
    body.setImmovable(true);

    body.setSize(
      scene.scale.width,
      8,
    );

    scene.tweens.add({
      targets: this,
      alpha: 0.45,
      duration: 120,
      yoyo: true,
      repeat: 3,
    });

    scene.time.delayedCall(
      TRAIL_LIFETIME,
      () => {
        if (this.active) {
          this.destroy();
        }
      },
    );
  }
}