import Phaser from "phaser";

const NORMAL_TEXTURE = "ravioli-enemy";
const CRACKED_TEXTURE = "ravioli-enemy-cracked";

const OUTLINE = 0x57351f;
const PASTA_DARK = 0xb9783f;
const PASTA = 0xe1ad59;
const PASTA_LIGHT = 0xf7d47a;
const FILLING = 0xa6382d;

const drawRavioli = (
  graphics: Phaser.GameObjects.Graphics,
  cracked: boolean,
) => {
  // Ridged outline
  graphics.fillStyle(OUTLINE, 1);
  graphics.fillRect(4, 0, 16, 2);
  graphics.fillRect(2, 2, 20, 16);
  graphics.fillRect(4, 18, 16, 2);

  graphics.fillRect(0, 4, 3, 3);
  graphics.fillRect(0, 9, 3, 3);
  graphics.fillRect(0, 14, 3, 3);

  graphics.fillRect(21, 4, 3, 3);
  graphics.fillRect(21, 9, 3, 3);
  graphics.fillRect(21, 14, 3, 3);

  // Pasta shell
  graphics.fillStyle(PASTA_DARK, 1);
  graphics.fillRect(4, 2, 16, 16);

  graphics.fillStyle(PASTA, 1);
  graphics.fillRect(5, 3, 14, 14);

  graphics.fillStyle(PASTA_LIGHT, 1);
  graphics.fillRect(6, 4, 12, 3);
  graphics.fillRect(5, 7, 3, 7);

  // Inner pillow
  graphics.fillStyle(PASTA_DARK, 1);
  graphics.fillRect(7, 7, 10, 8);

  graphics.fillStyle(PASTA, 1);
  graphics.fillRect(8, 8, 8, 6);

  // Angry eyes
  graphics.fillStyle(OUTLINE, 1);
  graphics.fillRect(8, 8, 3, 2);
  graphics.fillRect(13, 8, 3, 2);

  graphics.fillRect(9, 10, 2, 2);
  graphics.fillRect(13, 10, 2, 2);

  // Mouth
  graphics.fillRect(10, 13, 4, 2);

  if (!cracked) return;

  // Broken armor / exposed filling
  graphics.fillStyle(FILLING, 1);
  graphics.fillRect(16, 4, 3, 3);
  graphics.fillRect(17, 6, 2, 2);

  graphics.fillStyle(OUTLINE, 1);

  // Main crack
  graphics.fillRect(15, 3, 2, 4);
  graphics.fillRect(14, 6, 2, 3);
  graphics.fillRect(12, 8, 2, 3);

  // Lower crack
  graphics.fillRect(6, 13, 2, 3);
  graphics.fillRect(7, 15, 3, 2);

  // Broken corner
  graphics.fillRect(18, 15, 3, 2);
};

export const createRavioliEnemyTexture = (
  scene: Phaser.Scene,
) => {
  if (
    scene.textures.exists(NORMAL_TEXTURE) &&
    scene.textures.exists(CRACKED_TEXTURE)
  ) {
    return;
  }

  const graphics = scene.add.graphics();

  if (!scene.textures.exists(NORMAL_TEXTURE)) {
    drawRavioli(graphics, false);
    graphics.generateTexture(NORMAL_TEXTURE, 24, 20);
    graphics.clear();
  }

  if (!scene.textures.exists(CRACKED_TEXTURE)) {
    drawRavioli(graphics, true);
    graphics.generateTexture(CRACKED_TEXTURE, 24, 20);
  }

  graphics.destroy();
};