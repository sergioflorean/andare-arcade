import Phaser from "phaser";

export const createClassicBoxTexture = (scene: Phaser.Scene) => {
  const graphics = scene.make.graphics({ x: 0, y: 0 });

  // Transparent background
  graphics.clear();

  // Pasta
  graphics.fillStyle(0xf2c14e);

  graphics.fillRect(7, 2, 2, 5);
  graphics.fillRect(10, 1, 2, 6);
  graphics.fillRect(13, 2, 2, 5);
  graphics.fillRect(16, 3, 2, 4);

  // Pasta shadows
  graphics.fillStyle(0xc9862c);
  graphics.fillRect(8, 3, 1, 3);
  graphics.fillRect(11, 2, 1, 3);
  graphics.fillRect(14, 3, 1, 3);

  // Box outline
  graphics.fillStyle(0x4a2818);
  graphics.fillRect(4, 7, 16, 13);

  // Box body
  graphics.fillStyle(0xf4e3bd);
  graphics.fillRect(5, 8, 14, 11);

  // Box top rim
  graphics.fillStyle(0xd7bd91);
  graphics.fillRect(5, 8, 14, 2);

  // ANDARE red panel
  graphics.fillStyle(0xcf3d2e);
  graphics.fillRect(8, 11, 8, 6);

  // Pixel "A"
  graphics.fillStyle(0xf4e3bd);
  graphics.fillRect(11, 12, 2, 1);
  graphics.fillRect(10, 13, 1, 3);
  graphics.fillRect(13, 13, 1, 3);
  graphics.fillRect(11, 14, 2, 1);

  // Thrusters
  graphics.fillStyle(0xcf3d2e);
  graphics.fillRect(6, 20, 4, 2);
  graphics.fillRect(14, 20, 4, 2);

  // Flames
  graphics.fillStyle(0xf2c14e);
  graphics.fillRect(7, 22, 2, 2);
  graphics.fillRect(15, 22, 2, 2);

  graphics.generateTexture("classic-box", 24, 24);

  graphics.destroy();
};