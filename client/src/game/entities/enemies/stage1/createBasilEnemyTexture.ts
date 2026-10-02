import Phaser from "phaser";

const TEXTURE_KEY = "basil-enemy";

export const createBasilEnemyTexture = (scene: Phaser.Scene) => {
  if (scene.textures.exists(TEXTURE_KEY)) return;

  const graphics = scene.add.graphics();

  // Main leaf
  graphics.fillStyle(0x4f9b45, 1);
  graphics.fillRect(6, 1, 4, 2);
  graphics.fillRect(4, 3, 8, 2);
  graphics.fillRect(3, 5, 10, 5);
  graphics.fillRect(4, 10, 8, 2);
  graphics.fillRect(6, 12, 4, 2);

  // Light side
  graphics.fillStyle(0x73b85d, 1);
  graphics.fillRect(4, 5, 3, 4);
  graphics.fillRect(5, 4, 2, 1);

  // Center vein
  graphics.fillStyle(0x2f6733, 1);
  graphics.fillRect(7, 3, 2, 9);
  graphics.fillRect(5, 6, 2, 1);
  graphics.fillRect(9, 8, 2, 1);

  // Stem
  graphics.fillRect(7, 13, 2, 3);

  graphics.generateTexture(TEXTURE_KEY, 16, 16);
  graphics.destroy();
};