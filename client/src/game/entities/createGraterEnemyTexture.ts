import Phaser from "phaser";

const TEXTURE_KEY = "grater-enemy";

export const createGraterEnemyTexture = (
  scene: Phaser.Scene,
) => {
  if (scene.textures.exists(TEXTURE_KEY)) {
    return;
  }

  const graphics = scene.add.graphics();

  graphics.fillStyle(
    0xaaa79f,
    1,
  );

  graphics.fillRect(
    3,
    3,
    12,
    13,
  );

  graphics.fillStyle(
    0x5c5145,
    1,
  );

  graphics.fillRect(
    5,
    0,
    8,
    3,
  );

  graphics.fillRect(
    6,
    5,
    2,
    2,
  );

  graphics.fillRect(
    10,
    5,
    2,
    2,
  );

  graphics.fillRect(
    6,
    9,
    2,
    2,
  );

  graphics.fillRect(
    10,
    9,
    2,
    2,
  );

  graphics.fillRect(
    6,
    13,
    2,
    2,
  );

  graphics.fillRect(
    10,
    13,
    2,
    2,
  );

  graphics.generateTexture(
    TEXTURE_KEY,
    18,
    18,
  );

  graphics.destroy();
};