import Phaser from "phaser";

export const BOILING_WATER_TEXTURE = "boiling-water-hazard";

const WIDTH = 12;
const HEIGHT = 210;

export const createBoilingWaterTexture = (
  scene: Phaser.Scene,
) => {
  if (scene.textures.exists(BOILING_WATER_TEXTURE)) return;

  const graphics = scene.make.graphics({ x: 0, y: 0 });

  const DARK = 0x287b9c;
  const WATER = 0x4fb7d1;
  const LIGHT = 0xa8e7ec;
  const FOAM = 0xe7ffff;

  graphics.fillStyle(DARK, 0.75);
  graphics.fillRect(1, 0, 10, HEIGHT);

  graphics.fillStyle(WATER, 0.85);
  graphics.fillRect(2, 0, 8, HEIGHT);

  for (let y = 4; y < HEIGHT; y += 18) {
    graphics.fillStyle(LIGHT, 0.85);
    graphics.fillRect(3, y, 2, 7);
    graphics.fillRect(7, y + 6, 2, 6);

    graphics.fillStyle(FOAM, 0.8);
    graphics.fillRect(4, y + 2, 1, 2);
    graphics.fillRect(8, y + 9, 1, 2);
  }

  graphics.generateTexture(
    BOILING_WATER_TEXTURE,
    WIDTH,
    HEIGHT,
  );

  graphics.destroy();
};