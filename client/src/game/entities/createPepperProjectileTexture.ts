import Phaser from "phaser";

const TEXTURE_KEY = "pepper-projectile";

export const createPepperProjectileTexture = (
  scene: Phaser.Scene,
) => {
  if (scene.textures.exists(TEXTURE_KEY)) {
    scene.textures.remove(TEXTURE_KEY);
  }

  const graphics = scene.make.graphics({
    x: 0,
    y: 0,
  });

  // Base oscura del grano
  graphics.fillStyle(0x151515, 1);
  graphics.fillRect(0, 0, 2, 2);

  // Pixel claro para que se distinga como pimienta
  graphics.fillStyle(0xe8e1d2, 1);
  graphics.fillRect(0, 0, 1, 1);

  graphics.generateTexture(
    TEXTURE_KEY,
    2,
    2,
  );

  graphics.destroy();
};