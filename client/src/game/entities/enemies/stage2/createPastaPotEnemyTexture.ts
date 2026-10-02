import Phaser from "phaser";

const TEXTURE_KEY = "pasta-pot";

export const createPastaPotEnemyTexture = (
  scene: Phaser.Scene,
) => {
  if (scene.textures.exists(TEXTURE_KEY)) {
    return;
  }

  const graphics = scene.make.graphics({
    x: 0,
    y: 0,
  });

  const OUTLINE = 0x302821;
  const METAL_DARK = 0x777d83;
  const METAL = 0xb9bec2;
  const METAL_LIGHT = 0xe6e7df;

  const WATER = 0x63a6c7;
  const WATER_LIGHT = 0xa5d7df;

  const PASTA = 0xe7b84d;
  const PASTA_LIGHT = 0xffd86b;

  const RED = 0xd74432;
  const EYE = 0x241b17;

  // =========================
  // ASAS
  // =========================

  graphics.fillStyle(METAL_DARK, 1);

  graphics.fillRoundedRect(
    1,
    7,
    5,
    4,
    1,
  );

  graphics.fillRoundedRect(
    16,
    7,
    5,
    4,
    1,
  );

  // =========================
  // CUERPO DE LA OLLA
  // =========================

  graphics.fillStyle(METAL_DARK, 1);
  graphics.fillEllipse(
    11,
    10,
    16,
    15,
  );

  graphics.fillStyle(METAL, 1);
  graphics.fillEllipse(
    11,
    9,
    15,
    13,
  );

  graphics.fillStyle(METAL_LIGHT, 1);
  graphics.fillEllipse(
    9,
    7,
    7,
    4,
  );

  // =========================
  // INTERIOR / AGUA
  // =========================

  graphics.fillStyle(OUTLINE, 1);
  graphics.fillEllipse(
    11,
    7,
    13,
    8,
  );

  graphics.fillStyle(WATER, 1);
  graphics.fillEllipse(
    11,
    7,
    11,
    6,
  );

  graphics.fillStyle(WATER_LIGHT, 1);
  graphics.fillRect(
    7,
    5,
    3,
    1,
  );

  // =========================
  // PASTA
  // =========================

  graphics.lineStyle(
    1,
    PASTA,
    1,
  );

  graphics.beginPath();

  graphics.moveTo(7, 6);
  graphics.lineTo(9, 8);
  graphics.lineTo(11, 6);
  graphics.lineTo(13, 8);
  graphics.lineTo(15, 6);

  graphics.strokePath();

  graphics.lineStyle(
    1,
    PASTA_LIGHT,
    1,
  );

  graphics.beginPath();

  graphics.moveTo(8, 5);
  graphics.lineTo(10, 7);
  graphics.lineTo(12, 5);
  graphics.lineTo(14, 7);

  graphics.strokePath();

  // =========================
  // CARA
  // =========================

  graphics.fillStyle(EYE, 1);

  graphics.fillRect(
    7,
    11,
    2,
    2,
  );

  graphics.fillRect(
    13,
    11,
    2,
    2,
  );

  // Cejas enojadas
  graphics.lineStyle(
    1,
    RED,
    1,
  );

  graphics.beginPath();

  graphics.moveTo(6, 10);
  graphics.lineTo(9, 11);

  graphics.moveTo(13, 11);
  graphics.lineTo(16, 10);

  graphics.strokePath();

  // Boca
  graphics.fillStyle(EYE, 1);
  graphics.fillRect(
    9,
    14,
    4,
    1,
  );

  // =========================
  // BORDE SUPERIOR
  // =========================

  graphics.lineStyle(
    1,
    OUTLINE,
    1,
  );

  graphics.strokeEllipse(
    11,
    7,
    14,
    9,
  );

  graphics.strokeEllipse(
    11,
    10,
    16,
    15,
  );

  graphics.strokeRoundedRect(
    1,
    7,
    5,
    4,
    1,
  );

  graphics.strokeRoundedRect(
    16,
    7,
    5,
    4,
    1,
  );

  graphics.generateTexture(
    TEXTURE_KEY,
    22,
    19,
  );

  graphics.destroy();
};