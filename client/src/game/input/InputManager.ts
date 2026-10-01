import Phaser from "phaser";

export class InputManager {
  private keys: Record<
    "left" | "right" | "up" | "down" | "fire" | "start",
    Phaser.Input.Keyboard.Key
  >;

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard;

    if (!keyboard) {
      throw new Error("Keyboard input is not available");
    }

    this.keys = keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      fire: Phaser.Input.Keyboard.KeyCodes.SPACE,
      start: Phaser.Input.Keyboard.KeyCodes.ENTER,
    }) as typeof this.keys;
  }

  isLeftPressed() {
    return this.keys.left.isDown;
  }

  isRightPressed() {
    return this.keys.right.isDown;
  }

  isUpPressed() {
    return this.keys.up.isDown;
  }

  isDownPressed() {
    return this.keys.down.isDown;
  }

  isFirePressed() {
    return Phaser.Input.Keyboard.JustDown(this.keys.fire);
  }

  isFireHeld() {
    return this.keys.fire.isDown;
  }

  isStartPressed() {
    return Phaser.Input.Keyboard.JustDown(this.keys.start);
  }
}