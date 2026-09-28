import Phaser from "phaser";

import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { Enemy } from "../entities/Enemy";
import { Boss } from "../entities/Boss";
import { BossProjectile } from "../entities/BossProjectile";

import { InputManager } from "../input/InputManager";
import { WaveManager } from "../systems/WaveManager";

import { createClassicBoxTexture } from "../entities/createClassicBoxTexture";
import { createSpaghettiShotTexture } from "../entities/createSpaghettiShotTexture";
import { createTomatoEnemyTexture } from "../entities/createTomatoEnemyTexture";
import { createBossTexture } from "../entities/createBossTexture";
import { createBossProjectileTexture } from "../entities/createBossProjectileTexture";

import type { EnemyPattern } from "../types";

const PLAYER_START_X = 112;
const PLAYER_START_Y = 245;

const RESPAWN_DELAY = 500;
const BOSS_SCORE = 2000;

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private inputManager!: InputManager;
  private waveManager!: WaveManager;

  private projectiles: Projectile[] = [];
  private enemies: Enemy[] = [];
  private bossProjectiles: BossProjectile[] = [];

  private boss?: Boss;

  private bossHealthBarBackground?: Phaser.GameObjects.Graphics;
  private bossHealthBar?: Phaser.GameObjects.Graphics;

  private score = 0;
  private lives = 3;

  private shotsFired = 0;
  private hits = 0;
  private enemiesDefeated = 0;

  private scoreText!: Phaser.GameObjects.Text;
  private waveText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;

  private isPlayerInvulnerable = false;
  private isPlayerRespawning = false;
  private isGameOver = false;
  private isBossActive = false;
  private isStageClear = false;
  private isResultsVisible = false;

  constructor() {
    super("GameScene");
  }

  create() {
    this.physics.resume();

    this.score = 0;
    this.lives = 3;

    this.shotsFired = 0;
    this.hits = 0;
    this.enemiesDefeated = 0;

    this.projectiles = [];
    this.enemies = [];
    this.bossProjectiles = [];

    this.boss = undefined;

    this.bossHealthBar = undefined;
    this.bossHealthBarBackground = undefined;

    this.isPlayerInvulnerable = false;
    this.isPlayerRespawning = false;
    this.isGameOver = false;
    this.isBossActive = false;
    this.isStageClear = false;
    this.isResultsVisible = false;

    createClassicBoxTexture(this);
    createSpaghettiShotTexture(this);
    createTomatoEnemyTexture(this);
    createBossTexture(this);
    createBossProjectileTexture(this);

    this.inputManager =
      new InputManager(this);

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

      (
        waveNumber: number,
      ) => {
        this.updateWaveText(
          waveNumber,
        );
      },

      () => {
        this.handleWavesComplete();
      },
    );

    this.waveManager.start();
  }

  update(time: number) {
    if (this.isGameOver) {
      if (
        this.isResultsVisible &&
        this.inputManager.isStartPressed()
      ) {
        this.scene.restart();
      }

      return;
    }

    if (this.isStageClear) {
      if (
        this.isResultsVisible &&
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

    this.bossProjectiles.forEach(
      (projectile) => {
        projectile.update();
      },
    );

    if (
      this.boss &&
      this.boss.active
    ) {
      this.boss.update(
        time,
        this.player.x,
        this.player.y,
        (
          x: number,
          y: number,
          velocityX: number,
          velocityY: number,
        ) => {
          this.spawnBossProjectile(
            x,
            y,
            velocityX,
            velocityY,
          );
        },
      );
    }

    this.checkProjectileEnemyCollisions();
    this.checkProjectileBossCollisions();
    this.checkEnemyPlayerCollisions();
    this.checkBossProjectilePlayerCollisions();

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

    this.bossProjectiles =
      this.bossProjectiles.filter(
        (projectile) =>
          projectile.active,
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

    this.shotsFired += 1;
  }

  private spawnEnemy(
    x: number,
    pattern: EnemyPattern,
  ) {
    if (
      this.isGameOver ||
      this.isStageClear
    ) {
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

  private spawnBossProjectile(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
  ) {
    if (
      this.isGameOver ||
      this.isStageClear ||
      !this.isBossActive
    ) {
      return;
    }

    const projectile =
      new BossProjectile(
        this,
        x,
        y,
        velocityX,
        velocityY,
      );

    this.bossProjectiles.push(
      projectile,
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

            if (!hit) {
              return;
            }

            projectile.destroy();
            enemy.destroy();

            this.hits += 1;
            this.enemiesDefeated += 1;

            this.addScore(100);
          },
        );
      },
    );
  }

  private checkProjectileBossCollisions() {
    if (
      !this.boss ||
      !this.boss.active ||
      !this.isBossActive
    ) {
      return;
    }

    this.projectiles.forEach(
      (projectile) => {
        if (!projectile.active) {
          return;
        }

        const hit =
          this.physics.overlap(
            projectile,
            this.boss!,
          );

        if (!hit) {
          return;
        }

        projectile.destroy();

        this.hits += 1;

        const bossDefeated =
          this.boss!.takeDamage();

        this.updateBossHealthBar();

        if (bossDefeated) {
          this.defeatBoss();
        }
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

        if (!hit) {
          return;
        }

        enemy.destroy();

        this.damagePlayer();
      },
    );
  }

  private checkBossProjectilePlayerCollisions() {
    if (
      this.isPlayerInvulnerable ||
      this.isPlayerRespawning
    ) {
      return;
    }

    this.bossProjectiles.forEach(
      (projectile) => {
        if (!projectile.active) {
          return;
        }

        const hit =
          this.physics.overlap(
            this.player,
            projectile,
          );

        if (!hit) {
          return;
        }

        projectile.destroy();

        this.damagePlayer();
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

    this.projectiles.forEach(
      (projectile) => {
        projectile.destroy();
      },
    );

    this.projectiles = [];

    this.bossProjectiles.forEach(
      (projectile) => {
        projectile.destroy();
      },
    );

    this.bossProjectiles = [];

    const gameOverText =
      this.add
        .text(
          112,
          130,
          "GAME OVER",
          {
            fontFamily: "monospace",
            fontSize: "16px",
            color: "#e84a32",
          },
        )
        .setOrigin(0.5);

    this.time.delayedCall(
      1200,
      () => {
        gameOverText.destroy();

        this.showStageResults(
          "GAME OVER",
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

  private handleWavesComplete() {
    this.startBossWarning();
  }

  private startBossWarning() {
    this.waveText.setText(
      "WARNING",
    );

    const warningText =
      this.add
        .text(
          112,
          130,
          "WARNING",
          {
            fontFamily: "monospace",
            fontSize: "18px",
            color: "#e84a32",
          },
        )
        .setOrigin(0.5);

    this.tweens.add({
      targets: warningText,

      alpha: 0,

      duration: 250,

      yoyo: true,

      repeat: 3,

      onComplete: () => {
        warningText.destroy();

        if (
          this.isGameOver ||
          this.isStageClear
        ) {
          return;
        }

        this.spawnBoss();
      },
    });
  }

  private spawnBoss() {
    this.isBossActive = true;

    this.waveText.setText(
      "BOSS",
    );

    this.boss =
      new Boss(
        this,
        112,
        55,
      );

    this.createBossHealthBar();
  }

  private createBossHealthBar() {
    this.bossHealthBarBackground =
      this.add.graphics();

    this.bossHealthBar =
      this.add.graphics();

    this.bossHealthBarBackground.fillStyle(
      0x5c201a,
      1,
    );

    this.bossHealthBarBackground.fillRect(
      42,
      30,
      140,
      6,
    );

    this.updateBossHealthBar();
  }

  private updateBossHealthBar() {
    if (
      !this.boss ||
      !this.bossHealthBar
    ) {
      return;
    }

    const healthPercent =
      this.boss.getHealth() /
      this.boss.getMaxHealth();

    this.bossHealthBar.clear();

    this.bossHealthBar.fillStyle(
      0xe84a32,
      1,
    );

    this.bossHealthBar.fillRect(
      44,
      32,
      136 * healthPercent,
      2,
    );
  }

  private defeatBoss() {
    if (!this.boss) {
      return;
    }

    this.isBossActive = false;

    this.boss.destroy();

    this.bossProjectiles.forEach(
      (projectile) => {
        projectile.destroy();
      },
    );

    this.bossProjectiles = [];

    this.bossHealthBar?.destroy();
    this.bossHealthBarBackground?.destroy();

    this.addScore(
      BOSS_SCORE,
    );

    this.stageClear();
  }

  private stageClear() {
    this.isStageClear = true;

    this.waveText.setText(
      "STAGE CLEAR",
    );

    this.player.setVelocity(
      0,
      0,
    );

    this.projectiles.forEach(
      (projectile) => {
        projectile.destroy();
      },
    );

    this.projectiles = [];

    const stageClearText =
      this.add
        .text(
          112,
          130,
          "STAGE CLEAR",
          {
            fontFamily: "monospace",
            fontSize: "14px",
            color: "#f5e7c6",
          },
        )
        .setOrigin(0.5);

    this.time.delayedCall(
      1200,
      () => {
        stageClearText.destroy();

        this.showStageResults(
          "STAGE 01 CLEAR",
        );
      },
    );
  }

  private showStageResults(
    title: string,
  ) {
    this.isResultsVisible = true;

    const accuracy =
      this.shotsFired === 0
        ? 0
        : Math.round(
            (
              this.hits /
              this.shotsFired
            ) *
              100,
          );

    const background =
      this.add.graphics();

    background.fillStyle(
      0x17120d,
      0.96,
    );

    background.fillRect(
      12,
      42,
      200,
      204,
    );

    background.lineStyle(
      2,
      0xe84a32,
      1,
    );

    background.strokeRect(
      12,
      42,
      200,
      204,
    );

    this.add
      .text(
        112,
        57,
        title,
        {
          fontFamily: "monospace",
          fontSize: "12px",
          color: "#f5e7c6",
        },
      )
      .setOrigin(0.5);

    this.add.text(
      35,
      88,
      `SCORE      ${this.score
        .toString()
        .padStart(6, "0")}`,
      {
        fontFamily: "monospace",
        fontSize: "8px",
        color: "#f5e7c6",
      },
    );

    this.add.text(
      35,
      108,
      `ENEMIES    ${this.enemiesDefeated
        .toString()
        .padStart(2, "0")}`,
      {
        fontFamily: "monospace",
        fontSize: "8px",
        color: "#f5e7c6",
      },
    );

    this.add.text(
      35,
      128,
      `SHOTS      ${this.shotsFired
        .toString()
        .padStart(3, "0")}`,
      {
        fontFamily: "monospace",
        fontSize: "8px",
        color: "#f5e7c6",
      },
    );

    this.add.text(
      35,
      148,
      `HITS       ${this.hits
        .toString()
        .padStart(3, "0")}`,
      {
        fontFamily: "monospace",
        fontSize: "8px",
        color: "#f5e7c6",
      },
    );

    this.add.text(
      35,
      168,
      `ACCURACY   ${accuracy
        .toString()
        .padStart(3, " ")}%`,
      {
        fontFamily: "monospace",
        fontSize: "8px",
        color: "#e84a32",
      },
    );

    const startText =
      this.add
        .text(
          112,
          215,
          "PRESS START",
          {
            fontFamily: "monospace",
            fontSize: "8px",
            color: "#f5e7c6",
          },
        )
        .setOrigin(0.5);

    this.tweens.add({
      targets: startText,

      alpha: 0,

      duration: 500,

      yoyo: true,

      repeat: -1,
    });
  }
}