import Phaser from "phaser";

const TEXTURE_KEY =
  "power-up-parmesan";

export const createParmesanTexture = (
  scene: Phaser.Scene,
) => {
  if (
    scene.textures.exists(TEXTURE_KEY)
  ) {
    return;
  }

  const graphics =
    scene.add.graphics();

  // Cheese wedge
  graphics.fillStyle(
    0xf2cf66,
    1,
  );

  graphics.fillTriangle(
    2,
    14,
    14,
    14,
    12,
    3,
  );

  // Cheese holes
  graphics.fillStyle(
    0xc89c3c,
    1,
  );

  graphics.fillRect(
    7,
    8,
    2,
    2,
  );

  graphics.fillRect(
    10,
    11,
    2,
    2,
  );

  graphics.fillRect(
    5,
    12,
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