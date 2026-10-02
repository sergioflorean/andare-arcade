import Phaser from "phaser";

const TEXTURE_KEY = "meatball-enemy";

export const createMeatballEnemyTexture = (
  scene: Phaser.Scene,
) => {
  if (scene.textures.exists(TEXTURE_KEY)) {
    return;
  }

  const graphics = scene.add.graphics();

  const outline = 0x401b16;
  const meatDark = 0x713528;
  const meat = 0xa9573d;
  const meatLight = 0xd27a54;
  const sauce = 0xc92f27;
  const sauceLight = 0xf05a3b;
  const eye = 0xffe7bd;

  // Outline
  graphics.fillStyle(outline, 1);
  graphics.fillCircle(9, 9, 8);

  // Meat
  graphics.fillStyle(meatDark, 1);
  graphics.fillCircle(9, 9, 7);

  graphics.fillStyle(meat, 1);
  graphics.fillCircle(8, 8, 6);

  // Texture
  graphics.fillStyle(meatLight, 1);
  graphics.fillRect(4, 5, 2, 2);
  graphics.fillRect(11, 4, 2, 2);
  graphics.fillRect(13, 10, 2, 2);
  graphics.fillRect(5, 12, 2, 2);

  // Sauce
  graphics.fillStyle(sauce, 1);
  graphics.fillRect(4, 2, 10, 3);
  graphics.fillRect(6, 1, 6, 2);

  graphics.fillStyle(sauceLight, 1);
  graphics.fillRect(6, 2, 4, 1);

  // Angry eyes
  graphics.fillStyle(eye, 1);
  graphics.fillRect(5, 7, 3, 2);
  graphics.fillRect(10, 7, 3, 2);

  graphics.fillStyle(outline, 1);
  graphics.fillRect(6, 8, 2, 1);
  graphics.fillRect(10, 8, 2, 1);

  // Mouth
  graphics.fillRect(7, 12, 5, 2);
  graphics.fillRect(8, 14, 3, 1);

  graphics.generateTexture(TEXTURE_KEY, 18, 18);
  graphics.destroy();
};