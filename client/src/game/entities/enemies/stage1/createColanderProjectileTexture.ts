import Phaser from "phaser";

const TEXTURE_KEY =
  "colander-drop";

export const createColanderProjectileTexture = (
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

  graphics.fillStyle(
    0x9ed7df,
    1,
  );

  graphics.fillRect(
    2,
    0,
    2,
    2,
  );

  graphics.fillRect(
    1,
    2,
    4,
    4,
  );

  graphics.fillRect(
    2,
    6,
    2,
    2,
  );

  graphics.fillStyle(
    0xe8f4f2,
    1,
  );

  graphics.fillRect(
    2,
    2,
    1,
    2,
  );

  graphics.generateTexture(
    TEXTURE_KEY,
    6,
    8,
  );

  graphics.destroy();
};