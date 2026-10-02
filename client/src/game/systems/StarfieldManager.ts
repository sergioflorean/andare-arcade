import Phaser from "phaser";

interface StarData {
  sprite: Phaser.GameObjects.Rectangle;
  speed: number;
}

const MAIN_STAR_COUNT = 10;
const ACCENT_STAR_COUNT = 4;

const MAIN_COLORS = [
  0xe8e1cf,
  0xb8cbea,
];

const ACCENT_COLORS = [
  0x7767b7,
  0x5c91c9,
  0xb85c65,
];

export class StarfieldManager {
  private scene: Phaser.Scene;
  private stars: StarData[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    this.destroy();

    this.createStars(
      MAIN_STAR_COUNT,
      MAIN_COLORS,
      0.7,
      6,
      10,
    );

    this.createStars(
      ACCENT_STAR_COUNT,
      ACCENT_COLORS,
      0.55,
      5,
      8,
    );
  }

  update(delta: number) {
    const camera = this.scene.cameras.main;
    const deltaSeconds = delta / 1000;

    this.stars.forEach(({ sprite, speed }) => {
      sprite.y += speed * deltaSeconds;

      if (sprite.y > camera.height - 2) {
        sprite.y = 2;
        sprite.x = Phaser.Math.Between(
          2,
          camera.width - 3,
        );
      }
    });
  }

  destroy() {
    this.stars.forEach(({ sprite }) => {
      sprite.destroy();
    });

    this.stars = [];
  }

  private createStars(
    count: number,
    colors: number[],
    alpha: number,
    minSpeed: number,
    maxSpeed: number,
  ) {
    const camera = this.scene.cameras.main;

    for (let i = 0; i < count; i += 1) {
      const color =
        colors[
          Phaser.Math.Between(
            0,
            colors.length - 1,
          )
        ] ?? 0xffffff;

      const star = this.scene.add
        .rectangle(
          Phaser.Math.Between(
            2,
            camera.width - 3,
          ),
          Phaser.Math.Between(
            2,
            camera.height - 3,
          ),
          1,
          1,
          color,
        )
        .setDepth(-10)
        .setAlpha(
          Phaser.Math.FloatBetween(
            alpha - 0.15,
            alpha,
          ),
        )
        .setScrollFactor(0);

      this.stars.push({
        sprite: star,
        speed: Phaser.Math.Between(
          minSpeed,
          maxSpeed,
        ),
      });
    }
  }
}