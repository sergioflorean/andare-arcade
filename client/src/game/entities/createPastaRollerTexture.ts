import Phaser from "phaser";

export const PASTA_ROLLER_TEXTURE =
  "pasta-machine-roller";

export const createPastaRollerTexture = (
  scene: Phaser.Scene,
) => {
  if (
    scene.textures.exists(
      PASTA_ROLLER_TEXTURE,
    )
  ) {
    return;
  }

  const graphics = scene.make.graphics({
    x: 0,
    y: 0,
  });

  const OUTLINE = 0x292621;

  const METAL_DARK = 0x65625d;
  const METAL = 0xa7a49d;
  const METAL_LIGHT = 0xd8d5cc;

  const RED_DARK = 0x8c2921;
  const RED = 0xd34a38;

  // Side brackets
  graphics.fillStyle(OUTLINE, 1);
  graphics.fillRect(0, 3, 4, 14);
  graphics.fillRect(20, 3, 4, 14);

  graphics.fillStyle(RED_DARK, 1);
  graphics.fillRect(1, 5, 3, 10);
  graphics.fillRect(20, 5, 3, 10);

  graphics.fillStyle(RED, 1);
  graphics.fillRect(2, 6, 1, 7);
  graphics.fillRect(21, 6, 1, 7);

  // Roller outline
  graphics.fillStyle(OUTLINE, 1);
  graphics.fillRoundedRect(
    3,
    1,
    18,
    18,
    4,
  );

  // Roller body
  graphics.fillStyle(METAL_DARK, 1);
  graphics.fillRoundedRect(
    4,
    2,
    16,
    16,
    3,
  );

  graphics.fillStyle(METAL, 1);
  graphics.fillRect(6, 3, 12, 14);

  graphics.fillStyle(METAL_LIGHT, 1);
  graphics.fillRect(7, 4, 3, 12);

  graphics.fillStyle(METAL_DARK, 1);
  graphics.fillRect(16, 4, 2, 12);

  // Center groove
  graphics.fillStyle(OUTLINE, 1);
  graphics.fillRect(11, 3, 2, 14);

  graphics.generateTexture(
    PASTA_ROLLER_TEXTURE,
    24,
    20,
  );

  graphics.destroy();
};