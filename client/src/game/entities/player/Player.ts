import Phaser from "phaser";
import { InputManager } from "../../input/InputManager";

const PLAYER_SPEED = 90;

export class Player extends Phaser.Physics.Arcade.Sprite {
  private inputManager: InputManager;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    inputManager: InputManager,
  ) {
    super(scene, x, y, "classic-box");

    this.inputManager = inputManager;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
  }

  update() {
    this.setVelocity(0);

    if (this.inputManager.isLeftPressed()) {
      this.setVelocityX(-PLAYER_SPEED);
    }

    if (this.inputManager.isRightPressed()) {
      this.setVelocityX(PLAYER_SPEED);
    }

    if (this.inputManager.isUpPressed()) {
      this.setVelocityY(-PLAYER_SPEED);
    }

    if (this.inputManager.isDownPressed()) {
      this.setVelocityY(PLAYER_SPEED);
    }
  }
}