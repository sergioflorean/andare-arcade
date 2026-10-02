import Phaser from "phaser";

export const DOUGH_STRIP_TEXTURE = "dough-strip";

export const createDoughStripTexture = (
  scene: Phaser.Scene,
) => {
  if (scene.textures.exists(DOUGH_STRIP_TEXTURE)) return;

  const graphics = scene.make.graphics({ x: 0, y: 0 });

  const OUTLINE = 0x6f4b2a;
  const DOUGH_DARK = 0xb98950;
  const DOUGH = 0xe3bd73;
  const DOUGH_LIGHT = 0xf6dea3;

  graphics.fillStyle(OUTLINE, 1);
  graphics.fillRoundedRect(0, 0, 10, 22, 3);

  graphics.fillStyle(DOUGH_DARK, 1);
  graphics.fillRoundedRect(1, 1, 8, 20, 2);

  graphics.fillStyle(DOUGH, 1);
  graphics.fillRoundedRect(2, 1, 6, 19, 2);

  graphics.fillStyle(DOUGH_LIGHT, 1);
  graphics.fillRect(3, 3, 2, 14);

  graphics.fillStyle(DOUGH_DARK, 1);
  graphics.fillRect(6, 5, 1, 11);

  graphics.generateTexture(
    DOUGH_STRIP_TEXTURE,
    10,
    22,
  );

  graphics.destroy();
};