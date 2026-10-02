import Phaser from "phaser";

const TEXTURE_KEY = "fork-enemy";

export const createForkEnemyTexture = (
  scene: Phaser.Scene,
) => {
  if (scene.textures.exists(TEXTURE_KEY)) {
    return;
  }

  const graphics = scene.add.graphics();

  graphics.fillStyle(
    0xd9d2c3,
    1,
  );

  graphics.fillRect(
    6,
    4,
    4,
    12,
  );

  graphics.fillRect(
    3,
    0,
    2,
    7,
  );

  graphics.fillRect(
    6,
    0,
    2,
    7,
  );

  graphics.fillRect(
    9,
    0,
    2,
    7,
  );

  graphics.fillRect(
    12,
    0,
    2,
    7,
  );

  graphics.fillStyle(
    0x5c5145,
    1,
  );

  graphics.fillRect(
    6,
    12,
    4,
    4,
  );

  graphics.generateTexture(
    TEXTURE_KEY,
    16,
    16,
  );

  graphics.destroy();
};