import Phaser from "phaser";

const TEXTURE_KEY = "pepper-grinder-enemy";

export const createPepperGrinderEnemyTexture = (
  scene: Phaser.Scene,
) => {
  if (scene.textures.exists(TEXTURE_KEY)) return;

  const graphics = scene.add.graphics();

  const outline = 0x382821;
  const woodDark = 0x76503a;
  const wood = 0xb77a4d;
  const woodLight = 0xddaa6c;
  const metal = 0xd7d0bd;
  const pepper = 0x1d1b1a;

  // Top
  graphics.fillStyle(outline, 1);
  graphics.fillRect(6, 0, 8, 3);
  graphics.fillRect(4, 3, 12, 4);

  graphics.fillStyle(metal, 1);
  graphics.fillRect(6, 1, 8, 2);
  graphics.fillRect(5, 4, 10, 2);

  // Body outline
  graphics.fillStyle(outline, 1);
  graphics.fillRect(3, 7, 14, 15);

  // Wooden body
  graphics.fillStyle(woodDark, 1);
  graphics.fillRect(4, 8, 12, 13);

  graphics.fillStyle(wood, 1);
  graphics.fillRect(5, 8, 10, 12);

  graphics.fillStyle(woodLight, 1);
  graphics.fillRect(6, 9, 3, 9);

  // Angry eyes
  graphics.fillStyle(outline, 1);
  graphics.fillRect(6, 11, 3, 2);
  graphics.fillRect(11, 11, 3, 2);
  graphics.fillRect(7, 13, 2, 2);
  graphics.fillRect(11, 13, 2, 2);

  // Mouth
  graphics.fillRect(8, 17, 4, 2);

  // Bottom grinder
  graphics.fillRect(2, 22, 16, 4);

  graphics.fillStyle(metal, 1);
  graphics.fillRect(4, 22, 12, 2);

  // Pepper holes
  graphics.fillStyle(pepper, 1);
  graphics.fillRect(5, 24, 2, 2);
  graphics.fillRect(9, 24, 2, 2);
  graphics.fillRect(13, 24, 2, 2);

  graphics.generateTexture(TEXTURE_KEY, 20, 28);
  graphics.destroy();
};