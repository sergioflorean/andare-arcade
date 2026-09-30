import Phaser from "phaser";

const TEXTURE_KEY = "power-up-salsa-rossa";

export const createSalsaRossaTexture = (
  scene: Phaser.Scene,
) => {
  if (
    scene.textures.exists(TEXTURE_KEY)
  ) {
    return;
  }

  const graphics =
    scene.add.graphics();

  // Jar / bottle body
  graphics.fillStyle(
    0xe84a32,
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

  graphics.fillStyle(
    0xe84a32,
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