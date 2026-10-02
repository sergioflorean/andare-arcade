import Phaser from "phaser";

export const ROLLING_PIN_TRAIL_TEXTURE =
  "rolling-pin-trail";

const WIDTH = 224;
const HEIGHT = 10;

export const createRollingPinTrailTexture = (
  scene: Phaser.Scene,
) => {
  if (
    scene.textures.exists(
      ROLLING_PIN_TRAIL_TEXTURE,
    )
  ) {
    return;
  }

  const graphics =
    scene.make.graphics({
      x: 0,
      y: 0,
    });

  const DOUGH_DARK = 0xb88445;
  const DOUGH = 0xe4bd74;
  const DOUGH_LIGHT = 0xf5dda5;
  const FLOUR = 0xfff2cf;

  graphics.fillStyle(
    DOUGH_DARK,
    0.85,
  );

  graphics.fillRect(
    0,
    2,
    WIDTH,
    6,
  );

  graphics.fillStyle(
    DOUGH,
    0.95,
  );

  graphics.fillRect(
    0,
    3,
    WIDTH,
    4,
  );

  graphics.fillStyle(
    DOUGH_LIGHT,
    0.9,
  );

  for (
    let x = 4;
    x < WIDTH;
    x += 18
  ) {
    graphics.fillRect(
      x,
      3,
      8,
      1,
    );
  }

  graphics.fillStyle(
    FLOUR,
    0.8,
  );

  for (
    let x = 10;
    x < WIDTH;
    x += 27
  ) {
    graphics.fillRect(
      x,
      6,
      2,
      1,
    );
  }

  graphics.generateTexture(
    ROLLING_PIN_TRAIL_TEXTURE,
    WIDTH,
    HEIGHT,
  );

  graphics.destroy();
};