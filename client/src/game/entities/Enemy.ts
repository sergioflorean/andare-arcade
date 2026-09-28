import Phaser from "phaser";
import type { EnemyPattern } from "../types";

const ENEMY_SPEED = 40;
const ZIGZAG_SPEED = 55;

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private pattern: EnemyPattern;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    pattern: EnemyPattern = "straight",
  ) {
    super(scene, x, y, "tomato-enemy");

    this.pattern = pattern;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setVelocityY(ENEMY_SPEED);
  }

  update(time: number) {
    if (this.pattern === "straight") {
      this.setVelocityX(0);
    }

    if (this.pattern === "zigzag") {
      const direction = Math.sin(time / 250);

      this.setVelocityX(
        direction * ZIGZAG_SPEED,
      );
    }

    if (
      this.y - this.height >
      this.scene.scale.height
    ) {
      this.destroy();
    }
  }
}