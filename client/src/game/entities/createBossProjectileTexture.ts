import Phaser from "phaser";

const TEXTURE_KEY = "boss-projectile";

export const createBossProjectileTexture = (
  scene: Phaser.Scene,
) => {
  if (scene.textures.exists(TEXTURE_KEY)) {
    return;
  }

  const graphics = scene.add.graphics();

  // Tomato sauce projectile
  graphics.fillStyle(
    0xc9322b,
    1,
  );

  graphics.fillRect(
    1,
    0,
    4,
    6,
  );

  graphics.fillRect(
    0,
    2,
    6,
    4,
  );

  // Highlight
  graphics.fillStyle(
    0xf06a4f,
    1,
  );

  graphics.fillRect(
    1,
    1,
    2,
    2,
  );

  graphics.generateTexture(
    TEXTURE_KEY,
    6,
    8,
  );

  graphics.destroy();
};