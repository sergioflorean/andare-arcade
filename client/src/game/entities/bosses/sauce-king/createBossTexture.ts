import Phaser from "phaser";

const BOSS_TEXTURE_KEY = "boss";

export const createBossTexture = (scene: Phaser.Scene) => {
  if (scene.textures.exists(BOSS_TEXTURE_KEY)) return;

  const graphics = scene.add.graphics();

  const outline = 0x3a1d18;

  const tomatoDark = 0x98251f;
  const tomato = 0xd43b2f;
  const tomatoLight = 0xef654c;

  const armorDark = 0x8f806d;
  const armor = 0xd8c9ad;
  const armorLight = 0xf1e3c5;

  const leafDark = 0x315f32;
  const leaf = 0x55954a;

  const sauceDark = 0xb72b1f;
  const sauce = 0xf04d2f;
  const sauceLight = 0xffaa45;

  // Side thrusters
  graphics.fillStyle(outline, 1);
  graphics.fillRect(0, 13, 10, 22);
  graphics.fillRect(46, 13, 10, 22);

  graphics.fillStyle(armor, 1);
  graphics.fillRect(2, 14, 7, 18);
  graphics.fillRect(47, 14, 7, 18);

  graphics.fillStyle(armorLight, 1);
  graphics.fillRect(3, 15, 5, 4);
  graphics.fillRect(48, 15, 5, 4);

  graphics.fillStyle(outline, 1);
  graphics.fillRect(3, 22, 5, 7);
  graphics.fillRect(48, 22, 5, 7);

  graphics.fillStyle(tomatoLight, 1);
  graphics.fillRect(4, 23, 3, 5);
  graphics.fillRect(49, 23, 3, 5);

  // Main silhouette
  graphics.fillStyle(outline, 1);
  graphics.fillRect(9, 8, 38, 29);
  graphics.fillRect(13, 4, 30, 37);

  // Tomato core
  graphics.fillStyle(tomatoDark, 1);
  graphics.fillRect(11, 9, 34, 25);
  graphics.fillRect(15, 6, 26, 31);

  graphics.fillStyle(tomato, 1);
  graphics.fillRect(13, 10, 30, 21);
  graphics.fillRect(17, 7, 22, 27);

  graphics.fillStyle(tomatoLight, 1);
  graphics.fillRect(17, 9, 8, 3);
  graphics.fillRect(14, 13, 4, 6);

  // Leaf crown
  graphics.fillStyle(leafDark, 1);
  graphics.fillRect(25, 0, 6, 8);
  graphics.fillRect(17, 3, 10, 5);
  graphics.fillRect(29, 3, 10, 5);

  graphics.fillStyle(leaf, 1);
  graphics.fillRect(26, 1, 4, 6);
  graphics.fillRect(19, 4, 8, 3);
  graphics.fillRect(29, 4, 8, 3);

  // Armor
  graphics.fillStyle(armorDark, 1);
  graphics.fillRect(9, 28, 38, 8);
  graphics.fillRect(11, 24, 8, 8);
  graphics.fillRect(37, 24, 8, 8);

  graphics.fillStyle(armor, 1);
  graphics.fillRect(11, 29, 34, 5);
  graphics.fillRect(12, 25, 6, 5);
  graphics.fillRect(38, 25, 6, 5);

  graphics.fillStyle(armorLight, 1);
  graphics.fillRect(13, 29, 8, 2);
  graphics.fillRect(35, 29, 8, 2);

  // Angry eyes
  graphics.fillStyle(outline, 1);
  graphics.fillRect(15, 16, 11, 7);
  graphics.fillRect(30, 16, 11, 7);

  graphics.fillRect(17, 14, 9, 3);
  graphics.fillRect(30, 14, 9, 3);

  graphics.fillStyle(armorLight, 1);
  graphics.fillRect(18, 17, 7, 4);
  graphics.fillRect(31, 17, 7, 4);

  graphics.fillStyle(sauceLight, 1);
  graphics.fillRect(21, 18, 3, 3);
  graphics.fillRect(32, 18, 3, 3);

  // Central armored mouth
  graphics.fillStyle(outline, 1);
  graphics.fillRect(20, 27, 16, 11);

  graphics.fillStyle(armorDark, 1);
  graphics.fillRect(22, 28, 12, 7);

  graphics.fillStyle(armorLight, 1);
  graphics.fillRect(23, 29, 10, 2);

  graphics.fillStyle(outline, 1);
  graphics.fillRect(24, 32, 2, 4);
  graphics.fillRect(27, 32, 2, 4);
  graphics.fillRect(30, 32, 2, 4);

  // Sauce cannon
  graphics.fillStyle(sauceDark, 1);
  graphics.fillRect(24, 37, 8, 5);
  graphics.fillRect(26, 42, 4, 2);

  graphics.fillStyle(sauce, 1);
  graphics.fillRect(26, 37, 4, 5);
  graphics.fillRect(27, 42, 2, 2);

  graphics.fillStyle(sauceLight, 1);
  graphics.fillRect(27, 37, 2, 4);

  // Armor bolts
  graphics.fillStyle(outline, 1);
  graphics.fillRect(13, 32, 2, 2);
  graphics.fillRect(41, 32, 2, 2);

  graphics.generateTexture(
    BOSS_TEXTURE_KEY,
    56,
    44,
  );

  graphics.destroy();
};