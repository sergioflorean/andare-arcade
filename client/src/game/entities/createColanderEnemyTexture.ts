import Phaser from "phaser";

const TEXTURE_KEY =
  "colander-enemy";

export const createColanderEnemyTexture = (
  scene: Phaser.Scene,
) => {
  if (
    scene.textures.exists(
      TEXTURE_KEY,
    )
  ) {
    return;
  }

  const graphics =
    scene.add.graphics();

  // Handles
  graphics.fillStyle(
    0x5c5145,
    1,
  );

  graphics.fillRect(
    0,
    7,
    5,
    3,
  );

  graphics.fillRect(
    23,
    7,
    5,
    3,
  );

  // Bowl
  graphics.fillStyle(
    0xb8b5ad,
    1,
  );

  graphics.fillRect(
    4,
    4,
    20,
    10,
  );

  graphics.fillRect(
    6,
    14,
    16,
    3,
  );

  graphics.fillRect(
    9,
    17,
    10,
    2,
  );

  // Highlight
  graphics.fillStyle(
    0xe3dfd3,
    1,
  );

  graphics.fillRect(
    6,
    5,
    16,
    2,
  );

  graphics.fillRect(
    5,
    8,
    2,
    4,
  );

  // Holes
  graphics.fillStyle(
    0x5c5145,
    1,
  );

  graphics.fillRect(
    8,
    8,
    2,
    2,
  );

  graphics.fillRect(
    13,
    8,
    2,
    2,
  );

  graphics.fillRect(
    18,
    8,
    2,
    2,
  );

  graphics.fillRect(
    10,
    12,
    2,
    2,
  );

  graphics.fillRect(
    16,
    12,
    2,
    2,
  );

  graphics.generateTexture(
    TEXTURE_KEY,
    28,
    20,
  );

  graphics.destroy();
};