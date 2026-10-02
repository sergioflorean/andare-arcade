import Phaser from "phaser";

export const createTomatoEnemyTexture = (scene: Phaser.Scene) => {
  if (scene.textures.exists("tomato-enemy")) {
    return;
  }

  const graphics = scene.make.graphics({
    x: 0,
    y: 0,
  });

  // Tomato body
  graphics.fillStyle(0xd94432);
  graphics.fillRect(3, 4, 10, 9);

  graphics.fillRect(2, 6, 12, 5);

  // Tomato highlight
  graphics.fillStyle(0xf06a4f);
  graphics.fillRect(4, 5, 3, 2);

  // Leaves
  graphics.fillStyle(0x5c9b45);
  graphics.fillRect(6, 1, 3, 4);
  graphics.fillRect(4, 2, 7, 2);

  // Eyes
  graphics.fillStyle(0x21180f);
  graphics.fillRect(5, 7, 2, 2);
  graphics.fillRect(10, 7, 2, 2);

  graphics.generateTexture(
    "tomato-enemy",
    16,
    16,
  );

  graphics.destroy();
};