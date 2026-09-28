import Phaser from "phaser";

export class InputManager {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Phaser.Scene) {
    if (!scene.input.keyboard) {
      throw new Error("Keyboard input is not available");
    }

    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  isLeftPressed() {
    return this.cursors.left.isDown;
  }

  isRightPressed() {
    return this.cursors.right.isDown;
  }

  isUpPressed() {
    return this.cursors.up.isDown;
  }

  isDownPressed() {
    return this.cursors.down.isDown;
  }
}