import Phaser from "phaser";

const TEXTURE_KEY = "power-up-pesto";

export const createPestoTexture = (
  scene: Phaser.Scene,
) => {
  if (
    scene.textures.exists(TEXTURE_KEY)
  ) {
    return;
  }

  const graphics =
    scene.add.graphics();

  // Jar body
  graphics.fillStyle(
    0x4f8a3c,
    1,
  );

  graphics.fillRect(
    3,
    4,
    10,
    10,
  );

  // Cap
  graphics.fillStyle(
    0xf5e7c6,
    1,
  );

  graphics.fillRect(
    5,
    1,
    6,
    3,
  );

  // Label
  graphics.fillStyle(
    0xf5e7c6,
    1,
  );

  graphics.fillRect(
    5,
    7,
    6,
    4,
  );

  // Pesto mark
  graphics.fillStyle(
    0x4f8a3c,
    1,
  );

  graphics.fillRect(
    7,
    8,
    2,
    2,
  );

  graphics.generateTexture(
    TEXTURE_KEY,
    16,
    16,
  );

  graphics.destroy();
};