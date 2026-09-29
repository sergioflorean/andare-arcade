import Phaser from "phaser";

import type {
  EnemyPattern,
  EnemyType,
} from "../types";

const TOMATO_SPEED = 40;
const FORK_SPEED = 65;
const GRATER_SPEED = 45;

const TOMATO_ZIGZAG_SPEED = 55;
const FORK_ZIGZAG_SPEED = 45;
const GRATER_ZIGZAG_SPEED = 85;

const getTextureKey = (
  type: EnemyType,
) => {
  if (type === "fork") {
    return "fork-enemy";
  }

  if (type === "grater") {
    return "grater-enemy";
  }

  return "tomato-enemy";
};

const getVerticalSpeed = (
  type: EnemyType,
) => {
  if (type === "fork") {
    return FORK_SPEED;
  }

  if (type === "grater") {
    return GRATER_SPEED;
  }

  return TOMATO_SPEED;
};

const getZigzagSpeed = (
  type: EnemyType,
) => {
  if (type === "fork") {
    return FORK_ZIGZAG_SPEED;
  }

  if (type === "grater") {
    return GRATER_ZIGZAG_SPEED;
  }

  return TOMATO_ZIGZAG_SPEED;
};

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private pattern: EnemyPattern;
  private enemyType: EnemyType;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    pattern: EnemyPattern = "straight",
    type: EnemyType = "tomato",
  ) {
    super(
      scene,
      x,
      y,
      getTextureKey(type),
    );

    this.pattern = pattern;
    this.enemyType = type;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setVelocityY(
      getVerticalSpeed(
        this.enemyType,
      ),
    );
  }

  update(time: number) {
    if (
      this.pattern === "straight"
    ) {
      this.setVelocityX(0);
    }

    if (
      this.pattern === "zigzag"
    ) {
      const direction =
        Math.sin(time / 250);

      this.setVelocityX(
        direction *
          getZigzagSpeed(
            this.enemyType,
          ),
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