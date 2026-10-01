import Phaser from "phaser";

const TEXTURE_KEY = "boss-projectile";

export const createBossProjectileTexture = (
  scene: Phaser.Scene,
) => {
  if (scene.textures.exists(TEXTURE_KEY)) return;

  const graphics = scene.add.graphics();

  // Dark outline
  graphics.fillStyle(0x5c201a, 1);
  graphics.fillRect(2, 0, 4, 2);
  graphics.fillRect(1, 2, 6, 6);
  graphics.fillRect(2, 8, 4, 2);

  // Sauce body
  graphics.fillStyle(0xd83b28, 1);
  graphics.fillRect(2, 2, 4, 6);
  graphics.fillRect(1, 4, 6, 2);

  // Hot center
  graphics.fillStyle(0xff7a3d, 1);
  graphics.fillRect(3, 2, 2, 4);

  // Highlight
  graphics.fillStyle(0xffc15a, 1);
  graphics.fillRect(3, 2, 1, 2);

  graphics.generateTexture(
    TEXTURE_KEY,
    8,
    10,
  );

  graphics.destroy();
};