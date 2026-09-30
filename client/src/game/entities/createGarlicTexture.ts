import Phaser from "phaser";

const TEXTURE_KEY =
  "power-up-garlic";

export const createGarlicTexture = (
  scene: Phaser.Scene,
) => {
  if (
    scene.textures.exists(TEXTURE_KEY)
  ) {
    return;
  }

  const graphics =
    scene.add.graphics();

  // Garlic body
  graphics.fillStyle(
    0xf5e7c6,
    1,
  );

  graphics.fillCircle(
    8,
    9,
    5,
  );

  graphics.fillCircle(
    5,
    10,
    3,
  );

  graphics.fillCircle(
    11,
    10,
    3,
  );

  // Stem
  graphics.fillStyle(
    0x6f8f4e,
    1,
  );

  graphics.fillRect(
    7,
    1,
    2,
    4,
  );

  // Detail
  graphics.fillStyle(
    0xc9b99a,
    1,
  );

  graphics.fillRect(
    7,
    8,
    2,
    5,
  );

  graphics.generateTexture(
    TEXTURE_KEY,
    16,
    16,
  );

  graphics.destroy();
};