import Phaser from "phaser";

export class InputManager {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private fireKey: Phaser.Input.Keyboard.Key;
  private startKey: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene) {
    if (!scene.input.keyboard) {
      throw new Error(
        "Keyboard input is not available",
      );
    }

    this.cursors =
      scene.input.keyboard.createCursorKeys();

    this.fireKey =
      scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE,
      );

    this.startKey =
      scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ENTER,
      );
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

  isFirePressed() {
    return Phaser.Input.Keyboard.JustDown(
      this.fireKey,
    );
  }

  isFireHeld() {
  return this.fireKey.isDown;
}

  isStartPressed() {
    return Phaser.Input.Keyboard.JustDown(
      this.startKey,
    );
  }
}