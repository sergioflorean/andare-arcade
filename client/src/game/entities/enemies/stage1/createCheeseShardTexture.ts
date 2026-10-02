 import Phaser from "phaser";

const TEXTURE_KEY = "cheese-shard";

export const createCheeseShardTexture = (
  scene: Phaser.Scene,
) => {
  if (scene.textures.exists(TEXTURE_KEY)) return;

  const graphics = scene.add.graphics();

  graphics.fillStyle(0xf2cf66, 1);
  graphics.fillTriangle(
    1, 1,
    7, 4,
    2, 7,
  );

  graphics.fillStyle(0xc89c3c, 1);
  graphics.fillRect(3, 3, 2, 2);

  graphics.generateTexture(
    TEXTURE_KEY,
    8,
    8,
  );

  graphics.destroy();
};