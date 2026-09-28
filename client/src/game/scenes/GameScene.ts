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

const PLAYER_START_X = 112;
const PLAYER_START_Y = 245;

const RESPAWN_DELAY = 500;

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private inputManager!: InputManager;
  private waveManager!: WaveManager;

  private projectiles: Projectile[] = [];
  private enemies: Enemy[] = [];

  private score = 0;
  private lives = 3;

  private scoreText!: Phaser.GameObjects.Text;
  private waveText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;

  private isPlayerInvulnerable = false;
  private isPlayerRespawning = false;
  private isGameOver = false;

  constructor() {
    super("GameScene");
  }

create() {
  this.physics.resume();

  this.score = 0;
  this.lives = 3;

  this.projectiles = [];
  this.enemies = [];

  this.isPlayerInvulnerable = false;
  this.isPlayerRespawning = false;
  this.isGameOver = false;

  createClassicBoxTexture(this);
  createSpaghettiShotTexture(this);
  createTomatoEnemyTexture(this);

  this.inputManager = new InputManager(this);

  this.player = new Player(
    this,
    PLAYER_START_X,
    PLAYER_START_Y,
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
    if (this.isGameOver) {
      if (
        this.inputManager.isStartPressed()
      ) {
        this.scene.restart();
      }

      return;
    }

    if (!this.isPlayerRespawning) {
      this.player.update();

      if (
        this.inputManager.isFirePressed()
      ) {
        this.shoot();
      }
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
    this.checkEnemyPlayerCollisions();

    this.projectiles =
      this.projectiles.filter(
        (projectile) =>
          projectile.active,
      );

    this.enemies =
      this.enemies.filter(
        (enemy) =>
          enemy.active,
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

    this.livesText =
      this.add.text(
        170,
        18,
        "LIVES 3",
        {
          fontFamily: "monospace",
          fontSize: "8px",
          color: "#f5e7c6",
        },
      );
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
    if (this.isGameOver) {
      return;
    }

    const enemy =
      new Enemy(
        this,
        x,
        -16,
        pattern,
      );

    this.enemies.push(
      enemy,
    );
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

  private checkEnemyPlayerCollisions() {
    if (
      this.isPlayerInvulnerable ||
      this.isPlayerRespawning
    ) {
      return;
    }

    this.enemies.forEach(
      (enemy) => {
        if (!enemy.active) {
          return;
        }

        const hit =
          this.physics.overlap(
            this.player,
            enemy,
          );

        if (hit) {
          enemy.destroy();

          this.damagePlayer();
        }
      },
    );
  }

  private damagePlayer() {
    this.createHitFlash(
      this.player.x,
      this.player.y,
    );

    this.lives -= 1;

    this.livesText.setText(
      `LIVES ${this.lives}`,
    );

    if (this.lives <= 0) {
      this.gameOver();

      return;
    }

    this.startRespawn();
  }

  private startRespawn() {
    this.isPlayerInvulnerable = true;
    this.isPlayerRespawning = true;

    this.player.setVelocity(
      0,
      0,
    );

    this.player.setVisible(false);

    const body =
      this.player
        .body as Phaser.Physics.Arcade.Body;

    body.enable = false;

    this.time.delayedCall(
      RESPAWN_DELAY,
      () => {
        this.player.setPosition(
          PLAYER_START_X,
          PLAYER_START_Y,
        );

        body.enable = true;

        this.player.setVisible(true);
        this.player.setAlpha(1);

        this.isPlayerRespawning = false;

        this.startInvulnerabilityBlink();
      },
    );
  }

  private startInvulnerabilityBlink() {
    this.tweens.add({
      targets: this.player,

      alpha: 0.25,

      duration: 100,

      yoyo: true,

      repeat: 6,

      onComplete: () => {
        this.player.setAlpha(1);

        this.isPlayerInvulnerable = false;
      },
    });
  }

  private createHitFlash(
    x: number,
    y: number,
  ) {
    const flash =
      this.add.graphics();

    flash.fillStyle(
      0xf5e7c6,
      1,
    );

    flash.fillRect(
      x - 2,
      y - 10,
      4,
      20,
    );

    flash.fillRect(
      x - 10,
      y - 2,
      20,
      4,
    );

    flash.fillStyle(
      0xe84a32,
      1,
    );

    flash.fillRect(
      x - 6,
      y - 6,
      4,
      4,
    );

    flash.fillRect(
      x + 2,
      y - 6,
      4,
      4,
    );

    flash.fillRect(
      x - 6,
      y + 2,
      4,
      4,
    );

    flash.fillRect(
      x + 2,
      y + 2,
      4,
      4,
    );

    this.time.delayedCall(
      150,
      () => {
        flash.destroy();
      },
    );
  }

  private gameOver() {
    this.isGameOver = true;

    this.physics.pause();

    this.player.setVelocity(
      0,
      0,
    );

    this.player.setVisible(false);

    this.add
      .text(
        112,
        120,
        "GAME OVER",
        {
          fontFamily: "monospace",
          fontSize: "16px",
          color: "#e84a32",
        },
      )
      .setOrigin(0.5);

    const restartText =
      this.add
        .text(
          112,
          150,
          "PRESS START",
          {
            fontFamily: "monospace",
            fontSize: "8px",
            color: "#f5e7c6",
          },
        )
        .setOrigin(0.5);

    this.tweens.add({
      targets: restartText,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
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