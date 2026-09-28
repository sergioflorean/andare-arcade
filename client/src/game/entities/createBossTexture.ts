import Phaser from "phaser";

const BOSS_TEXTURE_KEY = "boss";

export const createBossTexture = (
  scene: Phaser.Scene,
) => {
  if (
    scene.textures.exists(
      BOSS_TEXTURE_KEY,
    )
  ) {
    return;
  }

  const graphics = scene.add.graphics();

  // Tomato body
  graphics.fillStyle(
    0xc9322b,
    1,
  );

  graphics.fillRect(
    4,
    6,
    32,
    22,
  );

  graphics.fillRect(
    8,
    2,
    24,
    30,
  );

  // Dark outline/details
  graphics.fillStyle(
    0x5c201a,
    1,
  );

  graphics.fillRect(
    4,
    10,
    4,
    14,
  );

  graphics.fillRect(
    32,
    10,
    4,
    14,
  );

  graphics.fillRect(
    10,
    28,
    20,
    4,
  );

  // Leaves
  graphics.fillStyle(
    0x3f7f3a,
    1,
  );

  graphics.fillRect(
    16,
    0,
    8,
    6,
  );

  graphics.fillRect(
    10,
    2,
    6,
    4,
  );

  graphics.fillRect(
    24,
    2,
    6,
    4,
  );

  // Eyes
  graphics.fillStyle(
    0xf5e7c6,
    1,
  );

  graphics.fillRect(
    11,
    12,
    6,
    6,
  );

  graphics.fillRect(
    23,
    12,
    6,
    6,
  );

  graphics.fillStyle(
    0x17120d,
    1,
  );

  graphics.fillRect(
    13,
    14,
    2,
    2,
  );

  graphics.fillRect(
    25,
    14,
    2,
    2,
  );

  // Angry mouth
  graphics.fillRect(
    14,
    23,
    12,
    3,
  );

  graphics.generateTexture(
    BOSS_TEXTURE_KEY,
    40,
    32,
  );

  graphics.destroy();
};