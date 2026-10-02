import Phaser from "phaser";

export const createSpaghettiShotTexture = (scene: Phaser.Scene) => {
  if (scene.textures.exists("spaghetti-shot")) {
    return;
  }

  const graphics = scene.make.graphics({
    x: 0,
    y: 0,
  });

  // Spaghetti body
  graphics.fillStyle(0xf2c14e);
  graphics.fillRect(1, 0, 2, 7);

  // Highlight
  graphics.fillStyle(0xf5e7c6);
  graphics.fillRect(1, 0, 1, 6);

  graphics.generateTexture(
    "spaghetti-shot",
    4,
    8,
  );

  graphics.destroy();
};