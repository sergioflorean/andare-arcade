import Phaser from "phaser";

export const PASTA_MACHINE_TEXTURE = "pasta-machine-boss";
export const PASTA_MACHINE_DAMAGED_TEXTURE = "pasta-machine-boss-damaged";

const createTexture = (
  scene: Phaser.Scene,
  textureKey: string,
  damaged: boolean,
) => {
  if (scene.textures.exists(textureKey)) return;

  const graphics = scene.make.graphics({ x: 0, y: 0 });

  const OUTLINE = 0x2a211b;

  const METAL_DARK = 0x69655e;
  const METAL = 0xaaa397;
  const METAL_LIGHT = 0xd8d0c2;

  const RED_DARK = 0x8f2c23;
  const RED = 0xcf4938;

  const ROLLER_DARK = 0x84613d;
  const ROLLER = 0xc89758;
  const ROLLER_LIGHT = 0xe3bd79;

  const DOUGH_DARK = 0xb98d4f;
  const DOUGH = 0xe7c477;
  const DOUGH_LIGHT = 0xf4dda2;

  const EYE = 0x261914;

  // Side supports
  graphics.fillStyle(OUTLINE, 1);
  graphics.fillRect(2, 10, 10, 32);
  graphics.fillRect(52, 10, 10, 32);

  graphics.fillStyle(METAL_DARK, 1);
  graphics.fillRect(4, 12, 6, 28);
  graphics.fillRect(54, 12, 6, 28);

  graphics.fillStyle(METAL_LIGHT, 1);
  graphics.fillRect(5, 13, 2, 21);
  graphics.fillRect(55, 13, 2, 21);

  // Main body
  graphics.fillStyle(OUTLINE, 1);
  graphics.fillRect(10, 4, 44, 42);

  graphics.fillStyle(METAL_DARK, 1);
  graphics.fillRect(12, 6, 40, 38);

  graphics.fillStyle(METAL, 1);
  graphics.fillRect(14, 8, 36, 34);

  graphics.fillStyle(METAL_LIGHT, 1);
  graphics.fillRect(15, 9, 32, 4);
  graphics.fillRect(15, 14, 4, 16);

  // Red casing
  graphics.fillStyle(OUTLINE, 1);
  graphics.fillRect(18, 2, 28, 10);

  graphics.fillStyle(RED_DARK, 1);
  graphics.fillRect(20, 4, 24, 7);

  graphics.fillStyle(RED, 1);
  graphics.fillRect(22, 4, 18, 3);

  // Eyes
  graphics.fillStyle(OUTLINE, 1);
  graphics.fillRect(17, 15, 12, 7);
  graphics.fillRect(35, 15, 12, 7);

  graphics.fillRect(19, 13, 10, 3);
  graphics.fillRect(35, 13, 10, 3);

  graphics.fillStyle(RED, 1);
  graphics.fillRect(20, 17, 7, 3);
  graphics.fillRect(37, 17, 7, 3);

  graphics.fillStyle(EYE, 1);
  graphics.fillRect(24, 17, 2, 3);
  graphics.fillRect(38, 17, 2, 3);

  // Roller chamber
  graphics.fillStyle(OUTLINE, 1);
  graphics.fillRect(14, 25, 36, 15);

  graphics.fillStyle(METAL_DARK, 1);
  graphics.fillRect(16, 27, 32, 11);

  // Upper roller
  graphics.fillStyle(ROLLER_DARK, 1);
  graphics.fillRect(18, 27, 28, 5);

  graphics.fillStyle(ROLLER, 1);
  graphics.fillRect(19, 28, 26, 3);

  graphics.fillStyle(ROLLER_LIGHT, 1);
  graphics.fillRect(21, 28, 16, 1);

  // Lower roller
  graphics.fillStyle(ROLLER_DARK, 1);
  graphics.fillRect(18, 33, 28, 5);

  graphics.fillStyle(ROLLER, 1);
  graphics.fillRect(19, 34, 26, 3);

  graphics.fillStyle(ROLLER_LIGHT, 1);
  graphics.fillRect(21, 34, 16, 1);

  // Bolts
  graphics.fillStyle(OUTLINE, 1);
  graphics.fillRect(13, 9, 2, 2);
  graphics.fillRect(49, 9, 2, 2);
  graphics.fillRect(13, 40, 2, 2);
  graphics.fillRect(49, 40, 2, 2);

  // Dough
  graphics.fillStyle(DOUGH_DARK, 1);
  graphics.fillRect(23, 40, 18, 8);

  graphics.fillStyle(DOUGH, 1);
  graphics.fillRect(25, 40, 14, 10);

  graphics.fillStyle(DOUGH_LIGHT, 1);
  graphics.fillRect(27, 41, 3, 8);
  graphics.fillRect(34, 41, 3, 8);

  // Blades
  graphics.fillStyle(OUTLINE, 1);
  graphics.fillRect(22, 38, 2, 5);
  graphics.fillRect(30, 38, 2, 5);
  graphics.fillRect(40, 38, 2, 5);

  if (damaged) {
  // Panel cracked
  graphics.fillStyle(0x5e4637, 1);
  graphics.fillRect(18, 11, 10, 6);

  graphics.fillStyle(0x2a1d18, 1);
  graphics.fillRect(19, 12, 6, 1);
  graphics.fillRect(23, 13, 1, 3);
  graphics.fillRect(21, 15, 5, 1);

  // Burn mark upper-right
  graphics.fillStyle(0x4b2a1a, 1);
  graphics.fillRect(42, 6, 8, 9);

  // Main fire upper-right
  graphics.fillStyle(0xd94b1f, 1);
  graphics.fillRect(44, 8, 6, 6);
  graphics.fillRect(46, 3, 4, 6);

  graphics.fillStyle(0xff7a24, 1);
  graphics.fillRect(45, 6, 5, 6);
  graphics.fillRect(47, 1, 3, 6);

  graphics.fillStyle(0xffc83d, 1);
  graphics.fillRect(46, 5, 3, 4);
  graphics.fillRect(48, 0, 2, 4);

  graphics.fillStyle(0xfff08a, 1);
  graphics.fillRect(47, 6, 2, 2);
  graphics.fillRect(49, 1, 1, 2);

  // Small side fire left
  graphics.fillStyle(0xd94b1f, 1);
  graphics.fillRect(11, 11, 4, 5);

  graphics.fillStyle(0xff7a24, 1);
  graphics.fillRect(12, 10, 3, 4);

  graphics.fillStyle(0xffc83d, 1);
  graphics.fillRect(13, 9, 2, 3);

  graphics.fillStyle(0xfff08a, 1);
  graphics.fillRect(13, 10, 1, 2);

  // Lower burn mark
  graphics.fillStyle(0x4b2a1a, 1);
  graphics.fillRect(36, 31, 10, 8);

  // Lower fire
  graphics.fillStyle(0xd94b1f, 1);
  graphics.fillRect(39, 33, 6, 5);
  graphics.fillRect(41, 30, 4, 4);

  graphics.fillStyle(0xff7a24, 1);
  graphics.fillRect(40, 32, 5, 4);
  graphics.fillRect(42, 29, 3, 3);

  graphics.fillStyle(0xffc83d, 1);
  graphics.fillRect(41, 32, 3, 3);
  graphics.fillRect(43, 29, 2, 2);

  graphics.fillStyle(0xfff08a, 1);
  graphics.fillRect(42, 33, 1, 1);

  // Smoke / scorch lower-left
  graphics.fillStyle(0x5a3422, 1);
  graphics.fillRect(15, 33, 7, 4);
  graphics.fillRect(17, 31, 4, 2);
}

  graphics.generateTexture(
    textureKey,
    64,
    50,
  );

  graphics.destroy();
};

export const createPastaMachineBossTexture = (
  scene: Phaser.Scene,
) => {
  createTexture(
    scene,
    PASTA_MACHINE_TEXTURE,
    false,
  );

  createTexture(
    scene,
    PASTA_MACHINE_DAMAGED_TEXTURE,
    true,
  );
};