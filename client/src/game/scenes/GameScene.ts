import Phaser from "phaser";

import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { Enemy } from "../entities/Enemy";

import { InputManager } from "../input/InputManager";
import { WaveManager } from "../systems/WaveManager";

import { createClassicBoxTexture } from "../entities/createClassicBoxTexture";
import { createSpaghettiShotTexture } from "../entities/createSpaghettiShotTexture";
import { createTomatoEnemyTexture } from "../entities/createTomatoEnemyTexture";

import type { EnemyPattern } from "../types";

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private inputManager!: InputManager;
  private waveManager!: WaveManager;

  private projectiles: Projectile[] = [];
  private enemies: Enemy[] = [];

  private score = 0;

  private scoreText!: Phaser.GameObjects.Text;
  private waveText!: Phaser.GameObjects.Text;

  constructor() {
    super("GameScene");
  }

  create() {
    createClassicBoxTexture(this);
    createSpaghettiShotTexture(this);
    createTomatoEnemyTexture(this);

    this.inputManager =
      new InputManager(this);

    this.player = new Player(
      this,
      112,
      245,
      this.inputManager,
    );

    this.createHud();

    this.waveManager = new WaveManager(
      this,

      (
        x: number,
        pattern: EnemyPattern,
      ) => {
        this.spawnEnemy(
          x,
          pattern,
        );
      },

      (waveNumber: number) => {
        this.updateWaveText(
          waveNumber,
        );
      },
    );

    this.waveManager.start();
  }

  update(time: number) {
    this.player.update();

    if (
      this.inputManager.isFirePressed()
    ) {
      this.shoot();
    }

    this.projectiles.forEach(
      (projectile) => {
        projectile.update();
      },
    );

    this.enemies.forEach(
      (enemy) => {
        enemy.update(time);
      },
    );

    this.checkProjectileEnemyCollisions();

    this.projectiles =
      this.projectiles.filter(
        (projectile) =>
          projectile.active,
      );

    this.enemies =
      this.enemies.filter(
        (enemy) => enemy.active,
      );

    this.waveManager.update(
      this.enemies.length,
    );
  }

  private createHud() {
    this.add.text(
      8,
      8,
      "1UP",
      {
        fontFamily: "monospace",
        fontSize: "8px",
        color: "#f5e7c6",
      },
    );

    this.scoreText =
      this.add.text(
        8,
        18,
        "000000",
        {
          fontFamily: "monospace",
          fontSize: "8px",
          color: "#e84a32",
        },
      );

    this.waveText =
      this.add
        .text(
          112,
          8,
          "WAVE 01",
          {
            fontFamily: "monospace",
            fontSize: "8px",
            color: "#f5e7c6",
          },
        )
        .setOrigin(0.5);
  }

  private shoot() {
    const projectile =
      new Projectile(
        this,
        this.player.x,
        this.player.y - 14,
      );

    this.projectiles.push(
      projectile,
    );
  }

  private spawnEnemy(
    x: number,
    pattern: EnemyPattern,
  ) {
    const enemy =
      new Enemy(
        this,
        x,
        -16,
        pattern,
      );

    this.enemies.push(enemy);
  }

  private checkProjectileEnemyCollisions() {
    this.projectiles.forEach(
      (projectile) => {
        this.enemies.forEach(
          (enemy) => {
            if (
              !projectile.active ||
              !enemy.active
            ) {
              return;
            }

            const hit =
              this.physics.overlap(
                projectile,
                enemy,
              );

            if (hit) {
              projectile.destroy();
              enemy.destroy();

              this.addScore(100);
            }
          },
        );
      },
    );
  }

  private addScore(
    points: number,
  ) {
    this.score += points;

    this.scoreText.setText(
      this.score
        .toString()
        .padStart(6, "0"),
    );
  }

  private updateWaveText(
    waveNumber: number,
  ) {
    this.waveText.setText(
      `WAVE ${waveNumber
        .toString()
        .padStart(2, "0")}`,
    );
  }
}