import Phaser from "phaser";

const TEXTURE_KEY = "classic-box";

export const createClassicBoxTexture = (
  scene: Phaser.Scene,
) => {
  if (scene.textures.exists(TEXTURE_KEY)) {
    return;
  }

  const graphics = scene.make.graphics({
    x: 0,
    y: 0,

  });

  const OUTLINE = 0x2a1c16;
  const HULL = 0xf0eadc;
  const HULL_SHADE = 0xc9c1b1;
  const RED = 0xe43b2f;
  const DARK_RED = 0xb22a22;
  const BLUE = 0x2f69b3;
  const BLUE_LIGHT = 0x74a8f0;
  const ENGINE = 0x5c5f69;
  const FLAME_YELLOW = 0xffcf3a;
  const FLAME_ORANGE = 0xff7a1a;
  const FLAME_RED = 0xe0451d;

  // Fondo transparente total: sprite aprox 32x32 dentro de 40x40
  // La nave apunta hacia arriba.

  // ========= PUNTA LARGA =========
  graphics.fillStyle(HULL, 1);
  graphics.fillTriangle(20, 2, 16, 14, 24, 14);

  graphics.fillStyle(HULL_SHADE, 1);
  graphics.fillTriangle(20, 4, 20, 14, 24, 14);

  graphics.lineStyle(1, OUTLINE, 1);
  graphics.strokeTriangle(20, 2, 16, 14, 24, 14);

  graphics.fillStyle(RED, 1);
  graphics.fillRect(19, 3, 2, 9);
  graphics.fillRect(17, 11, 1, 4);
  graphics.fillRect(22, 11, 1, 4);

  // ========= CABINA / CUERPO FRONTAL =========
  graphics.fillStyle(HULL, 1);
  graphics.fillRoundedRect(14, 12, 12, 12, 2);

  graphics.fillStyle(HULL_SHADE, 1);
  graphics.fillRect(20, 12, 6, 12);

  graphics.lineStyle(1, OUTLINE, 1);
  graphics.strokeRoundedRect(14, 12, 12, 12, 2);

  graphics.fillStyle(BLUE, 1);
  graphics.fillRoundedRect(17, 14, 6, 8, 2);

  graphics.fillStyle(BLUE_LIGHT, 1);
  graphics.fillRect(18, 15, 1, 5);
  graphics.fillRect(20, 15, 1, 6);

  graphics.lineStyle(1, 0x17385c, 1);
  graphics.strokeRoundedRect(17, 14, 6, 8, 2);

  // ========= CUERPO CENTRAL =========
  graphics.fillStyle(HULL, 1);
  graphics.fillRoundedRect(12, 22, 16, 7, 2);

  graphics.fillStyle(HULL_SHADE, 1);
  graphics.fillRect(20, 22, 8, 7);

  graphics.lineStyle(1, OUTLINE, 1);
  graphics.strokeRoundedRect(12, 22, 16, 7, 2);

  // Emblema A visible
  graphics.fillStyle(RED, 1);
  graphics.fillTriangle(20, 24, 17, 28, 23, 28);
  graphics.fillRect(19, 26, 2, 3);
  graphics.fillStyle(0xf2d268, 1);
  graphics.fillRect(17, 29, 6, 1);

  // ========= ALAS MÁS ATRÁS =========
  graphics.fillStyle(HULL, 1);

  // Ala izquierda
  graphics.fillTriangle(12, 22, 4, 28, 12, 31);
  graphics.fillTriangle(12, 31, 5, 33, 12, 35);

  // Ala derecha
  graphics.fillTriangle(28, 22, 36, 28, 28, 31);
  graphics.fillTriangle(28, 31, 35, 33, 28, 35);

  graphics.fillStyle(HULL_SHADE, 1);
  graphics.fillTriangle(28, 22, 36, 28, 28, 31);
  graphics.fillTriangle(28, 31, 35, 33, 28, 35);

  graphics.lineStyle(1, OUTLINE, 1);
  graphics.strokeTriangle(12, 22, 4, 28, 12, 31);
  graphics.strokeTriangle(12, 31, 5, 33, 12, 35);
  graphics.strokeTriangle(28, 22, 36, 28, 28, 31);
  graphics.strokeTriangle(28, 31, 35, 33, 28, 35);

  // Franjas rojas de alas
  graphics.fillStyle(RED, 1);
  graphics.fillTriangle(10, 24, 6, 28, 10, 29);
  graphics.fillTriangle(30, 24, 34, 28, 30, 29);

  // Cañones laterales verticales
  graphics.fillStyle(HULL, 1);
  graphics.fillRoundedRect(3, 24, 3, 10, 1);
  graphics.fillRoundedRect(34, 24, 3, 10, 1);

  graphics.fillStyle(HULL_SHADE, 1);
  graphics.fillRect(5, 24, 1, 10);
  graphics.fillRect(36, 24, 1, 10);

  graphics.lineStyle(1, OUTLINE, 1);
  graphics.strokeRoundedRect(3, 24, 3, 10, 1);
  graphics.strokeRoundedRect(34, 24, 3, 10, 1);

  graphics.fillStyle(RED, 1);
  graphics.fillRect(4, 26, 1, 2);
  graphics.fillRect(35, 26, 1, 2);

  // ========= UNIONES DE ALA / CUERPO =========
  graphics.fillStyle(ENGINE, 1);
  graphics.fillRect(10, 28, 3, 4);
  graphics.fillRect(27, 28, 3, 4);

  graphics.lineStyle(1, OUTLINE, 1);
  graphics.strokeRect(10, 28, 3, 4);
  graphics.strokeRect(27, 28, 3, 4);

  // ========= MOTORES =========
  graphics.fillStyle(ENGINE, 1);
  graphics.fillRect(17, 30, 2, 4);
  graphics.fillRect(21, 30, 2, 4);

  graphics.lineStyle(1, OUTLINE, 1);
  graphics.strokeRect(17, 30, 2, 4);
  graphics.strokeRect(21, 30, 2, 4);

  graphics.fillStyle(FLAME_YELLOW, 1);
  graphics.fillRect(17, 34, 2, 3);
  graphics.fillRect(21, 34, 2, 3);

  graphics.fillStyle(FLAME_ORANGE, 1);
  graphics.fillRect(17, 36, 2, 2);
  graphics.fillRect(21, 36, 2, 2);

  graphics.fillStyle(FLAME_RED, 1);
  graphics.fillRect(17, 38, 2, 1);
  graphics.fillRect(21, 38, 2, 1);

  // ========= DETALLES FINALES =========
  graphics.fillStyle(DARK_RED, 1);
  graphics.fillRect(14, 24, 1, 2);
  graphics.fillRect(25, 24, 1, 2);
  graphics.fillRect(18, 28, 1, 1);
  graphics.fillRect(21, 28, 1, 1);

  graphics.generateTexture(TEXTURE_KEY, 40, 40);
  graphics.destroy();
};