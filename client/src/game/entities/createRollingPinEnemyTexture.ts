import Phaser from "phaser";

const TEXTURE_KEY = "rolling-pin-enemy";

export const createRollingPinEnemyTexture = (
  scene: Phaser.Scene,
) => {
  if (scene.textures.exists(TEXTURE_KEY)) return;

  const graphics = scene.make.graphics({ x: 0, y: 0 });

  const OUTLINE = 0x2b1c13;
  const WOOD_DARK = 0x8b4f2c;
  const WOOD = 0xc77b42;
  const WOOD_LIGHT = 0xe0a05d;
  const METAL = 0x777b80;
  const METAL_LIGHT = 0xc1c5c8;
  const RED = 0xd94432;
  const EYE = 0x241713;

  // Handles
  graphics.fillStyle(WOOD_DARK, 1);
  graphics.fillRoundedRect(1, 7, 5, 4, 1);
  graphics.fillRoundedRect(22, 7, 5, 4, 1);

  graphics.fillStyle(WOOD_LIGHT, 1);
  graphics.fillRect(2, 8, 4, 1);
  graphics.fillRect(22, 8, 4, 1);

  // Metal joins
  graphics.fillStyle(METAL, 1);
  graphics.fillRect(6, 6, 2, 6);
  graphics.fillRect(20, 6, 2, 6);

  graphics.fillStyle(METAL_LIGHT, 1);
  graphics.fillRect(6, 7, 1, 3);
  graphics.fillRect(20, 7, 1, 3);

  // Main wooden roller
  graphics.fillStyle(OUTLINE, 1);
  graphics.fillRoundedRect(7, 3, 14, 12, 4);

  graphics.fillStyle(WOOD, 1);
  graphics.fillRoundedRect(8, 4, 12, 10, 3);

  // Wood highlights
  graphics.fillStyle(WOOD_LIGHT, 1);
  graphics.fillRect(10, 5, 7, 2);
  graphics.fillRect(9, 8, 3, 1);

  graphics.fillStyle(WOOD_DARK, 1);
  graphics.fillRect(17, 8, 2, 4);
  graphics.fillRect(10, 12, 7, 1);

  // Angry face
  graphics.fillStyle(EYE, 1);
  graphics.fillRect(10, 8, 2, 2);
  graphics.fillRect(16, 8, 2, 2);

  graphics.lineStyle(1, RED, 1);

  graphics.beginPath();
  graphics.moveTo(9, 7);
  graphics.lineTo(12, 8);
  graphics.moveTo(16, 8);
  graphics.lineTo(19, 7);
  graphics.strokePath();

  graphics.fillStyle(EYE, 1);
  graphics.fillRect(12, 11, 4, 1);

  // Small red arcade markings
  graphics.fillStyle(RED, 1);
  graphics.fillRect(8, 5, 1, 3);
  graphics.fillRect(19, 10, 1, 3);

  // Outline details
  graphics.lineStyle(1, OUTLINE, 1);
  graphics.strokeRoundedRect(1, 7, 5, 4, 1);
  graphics.strokeRoundedRect(22, 7, 5, 4, 1);
  graphics.strokeRect(6, 6, 2, 6);
  graphics.strokeRect(20, 6, 2, 6);

  graphics.generateTexture(TEXTURE_KEY, 28, 18);
  graphics.destroy();
};