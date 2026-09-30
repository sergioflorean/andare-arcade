import Phaser from "phaser";

import type {
  PowerUpType,
} from "../types";

const POWER_UP_SPEED = 35;

const getTextureKey = (
  powerUpType: PowerUpType,
) => `power-up-${powerUpType}`;

export class PowerUp extends Phaser.Physics.Arcade.Sprite {
  private powerUpType:
    PowerUpType;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    powerUpType:
      PowerUpType,
  ) {
    super(
      scene,
      x,
      y,
      getTextureKey(
        powerUpType,
      ),
    );

    this.powerUpType =
      powerUpType;

    scene.add.existing(this);

    scene.physics.add.existing(
      this,
    );

    this.setVelocityY(
      POWER_UP_SPEED,
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

  getPowerUpType() {
    return this.powerUpType;
  }
}