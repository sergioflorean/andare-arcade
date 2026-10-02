import Phaser from "phaser";
import { BOILING_WATER_TEXTURE } from "./createBoilingWaterTexture";

const HAZARD_LIFETIME = 700;
const WATER_OFFSET_Y = 8;

export class BoilingWaterHazard extends Phaser.Physics.Arcade.Sprite {
  private owner: Phaser.Physics.Arcade.Sprite;

  constructor(
    scene: Phaser.Scene,
    owner: Phaser.Physics.Arcade.Sprite,
  ) {
    super(
      scene,
      owner.x,
      owner.y + WATER_OFFSET_Y,
      BOILING_WATER_TEXTURE,
    );

    this.owner = owner;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 0);
    this.setDepth(4);
    this.setAlpha(0.8);

    const body = this.body as Phaser.Physics.Arcade.Body;

    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(10, 205);
    body.setOffset(1, 0);

    scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 90,
      yoyo: true,
      repeat: 3,
    });

    scene.time.delayedCall(
      HAZARD_LIFETIME,
      () => {
        if (this.active) {
          this.destroy();
        }
      },
    );
  }

  update() {
    if (!this.owner.active) {
      this.destroy();
      return;
    }

    this.setPosition(
      Math.round(this.owner.x),
      Math.round(this.owner.y + WATER_OFFSET_Y),
    );
  }
}