import Phaser from "phaser";


const PASTA = 0xf2cf66;
const SAUCE = 0xe84a32;
const DARK_SAUCE = 0xb92e1f;
const BOX = 0xd8c8a8;

export class HitEffectManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  play(x: number, y: number) {
    this.scene.cameras.main.shake(120, 0.004);

    this.createFlash(x, y);
    this.createPastaBurst(x, y);
    this.createSauceSplash(x, y);
    this.createSauceStain(x, y);
    this.createBoxFragments(x, y);
  }

  private createFlash(x: number, y: number) {
    const flash = this.scene.add.circle(
      x,
      y,
      7,
      SAUCE,
      0.7,
    );

    this.scene.tweens.add({
      targets: flash,
      scale: 2,
      alpha: 0,
      duration: 120,
      onComplete: () => flash.destroy(),
    });
  }

  private createPastaBurst(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      const noodle = this.scene.add.rectangle(
        x,
        y,
        2,
        Phaser.Math.Between(6, 10),
        PASTA,
      );

      noodle.setAngle(
        Phaser.Math.Between(-60, 60),
      );

      const direction = i % 2 === 0 ? -1 : 1;

      const targetX =
        x + direction * Phaser.Math.Between(8, 22);

      const peakY =
        y - Phaser.Math.Between(8, 18);

      this.scene.tweens.add({
        targets: noodle,
        x: targetX,
        y: peakY,
        angle:
          noodle.angle +
          Phaser.Math.Between(-90, 90),
        duration: 100,
        onComplete: () => {
          this.scene.tweens.add({
            targets: noodle,
            y:
              peakY +
              Phaser.Math.Between(18, 30),
            angle:
              noodle.angle +
              Phaser.Math.Between(-90, 90),
            alpha: 0,
            duration: 220,
            ease: "Quad.easeIn",
            onComplete: () => noodle.destroy(),
          });
        },
      });
    }
  }

  private createSauceSplash(x: number, y: number) {
    for (let i = 0; i < 12; i++) {
      const isDark = i % 3 === 0;

      const drop = this.scene.add.circle(
        x,
        y,
        Phaser.Math.Between(1, 3),
        isDark ? DARK_SAUCE : SAUCE,
        1,
      );

      const angle = Phaser.Math.FloatBetween(
        0,
        Math.PI * 2,
      );

      const distance = Phaser.Math.Between(10, 24);

      this.scene.tweens.add({
        targets: drop,
        x: x + Math.cos(angle) * distance,
        y:
          y +
          Math.sin(angle) * distance +
          Phaser.Math.Between(4, 10),
        alpha: 0,
        scale: 0.4,
        duration: Phaser.Math.Between(160, 260),
        onComplete: () => drop.destroy(),
      });
    }
  }

  private createSauceStain(x: number, y: number) {
    const stain = this.scene.add.ellipse(
      x,
      y + 4,
      16,
      10,
      SAUCE,
      0.9,
    );

    stain.setAngle(
      Phaser.Math.Between(-20, 20),
    );

    this.scene.tweens.add({
      targets: stain,
      scaleX: 1.5,
      scaleY: 1.2,
      alpha: 0,
      duration: 240,
      onComplete: () => stain.destroy(),
    });
  }

  private createBoxFragments(x: number, y: number) {
    for (let i = 0; i < 4; i++) {
      const fragment = this.scene.add.rectangle(
        x,
        y,
        4,
        3,
        BOX,
      );

      const direction = i % 2 === 0 ? -1 : 1;

      this.scene.tweens.add({
        targets: fragment,
        x:
          x +
          direction * Phaser.Math.Between(10, 18),
        y:
          y +
          Phaser.Math.Between(-12, 12),
        angle: Phaser.Math.Between(-120, 120),
        alpha: 0,
        duration: 200,
        onComplete: () => fragment.destroy(),
      });
    }
  }
}