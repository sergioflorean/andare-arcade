import Phaser from "phaser";

import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { Enemy } from "../entities/Enemy";
import { Boss } from "../entities/Boss";
import { BossProjectile } from "../entities/BossProjectile";

import { InputManager } from "../input/InputManager";
import { WaveManager } from "../systems/WaveManager";
import { StatsManager } from "../systems/StatsManager";
import { GameUI } from "../ui/GameUI";

import { createClassicBoxTexture } from "../entities/createClassicBoxTexture";
import { createSpaghettiShotTexture } from "../entities/createSpaghettiShotTexture";
import { createTomatoEnemyTexture } from "../entities/createTomatoEnemyTexture";
import { createForkEnemyTexture } from "../entities/createForkEnemyTexture";
import { createGraterEnemyTexture } from "../entities/createGraterEnemyTexture";
import { createBossTexture } from "../entities/createBossTexture";
import { createBossProjectileTexture } from "../entities/createBossProjectileTexture";

import type {
  EnemyPattern,
  EnemyType,
} from "../types";

const PLAYER_START_X = 112;
const PLAYER_START_Y = 245;

const RESPAWN_DELAY = 500;
const BOSS_SCORE = 2000;

const MAX_STAGE = 2;

export class GameScene extends Phaser.Scene {
  private player!: Player;

  private inputManager!: InputManager;
  private waveManager!: WaveManager;
  private statsManager!: StatsManager;
  private uiManager!: GameUI;

  private projectiles: Projectile[] = [];
  private enemies: Enemy[] = [];
  private bossProjectiles: BossProjectile[] = [];

  private boss?: Boss;

  private bossHealthBarBackground?: Phaser.GameObjects.Graphics;
  private bossHealthBar?: Phaser.GameObjects.Graphics;

  private lives = 3;
  private currentStage = 1;

  private isPlayerInvulnerable = false;
  private isPlayerRespawning = false;

  private isGameOver = false;
  private isBossActive = false;
  private isStageClear = false;
  private isResultsVisible = false;
  private isGameComplete = false;

  constructor() {
    super("GameScene");
  }

  create() {
    this.physics.resume();

    this.statsManager = new StatsManager();
    this.uiManager = new GameUI(this);

    this.lives = 3;
    this.currentStage = 1;

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
    this.isGameComplete = false;

    createClassicBoxTexture(this);
    createSpaghettiShotTexture(this);

    createTomatoEnemyTexture(this);
    createForkEnemyTexture(this);
    createGraterEnemyTexture(this);

    createBossTexture(this);
    createBossProjectileTexture(this);

    this.inputManager = new InputManager(this);

    this.player = new Player(
      this,
      PLAYER_START_X,
      PLAYER_START_Y,
      this.inputManager,
    );

    this.uiManager.createHud(
      this.statsManager.getScore(),
      this.lives,
    );

    this.startStage();
  }

  update(time: number) {
    if (this.isGameComplete) {
      if (this.inputManager.isStartPressed()) {
        this.scene.restart();
      }

      return;
    }

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
        if (this.currentStage < MAX_STAGE) {
          this.startNextStage();
        } else {
          this.showGameComplete();
        }
      }

      return;
    }

    if (!this.isPlayerRespawning) {
      this.player.update();

      if (this.inputManager.isFirePressed()) {
        this.shoot();
      }
    }

    this.projectiles.forEach((projectile) => {
      projectile.update();
    });

    this.enemies.forEach((enemy) => {
      enemy.update(time);
    });

    this.bossProjectiles.forEach((projectile) => {
      projectile.update();
    });

    if (this.boss && this.boss.active) {
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

  private startStage() {
    this.waveManager = new WaveManager(
      this,
      this.currentStage,

      (
        x: number,
        pattern: EnemyPattern,
        type: EnemyType,
      ) => {
        this.spawnEnemy(
          x,
          pattern,
          type,
        );
      },

      (
        waveNumber: number,
      ) => {
        this.uiManager.updateWave(
          waveNumber,
        );
      },

      () => {
        this.handleWavesComplete();
      },
    );

    this.waveManager.start();
  }

  private startNextStage() {
    this.currentStage += 1;

    this.uiManager.hideResults();
    this.uiManager.showHud();

    this.isStageClear = false;
    this.isResultsVisible = false;

    this.isBossActive = false;
    this.isGameOver = false;

    this.isPlayerInvulnerable = false;
    this.isPlayerRespawning = false;

    this.statsManager.resetStageStats();

    this.clearStageObjects();

    this.boss = undefined;

    this.destroyBossHealthBar();

    this.player.setPosition(
      PLAYER_START_X,
      PLAYER_START_Y,
    );

    this.player.setVisible(true);
    this.player.setAlpha(1);

    this.player.setVelocity(
      0,
      0,
    );

    const body =
      this.player
        .body as Phaser.Physics.Arcade.Body;

    body.enable = true;

    this.physics.resume();

    this.uiManager.updateScore(
      this.statsManager.getScore(),
    );

    this.uiManager.updateLives(
      this.lives,
    );

    this.uiManager.showStageIntro(
      this.currentStage,
      () => {
        if (
          this.isGameOver ||
          this.isStageClear ||
          this.isGameComplete
        ) {
          return;
        }

        this.startStage();
      },
    );
  }

  private clearStageObjects() {
    this.projectiles.forEach(
      (projectile) => {
        projectile.destroy();
      },
    );

    this.enemies.forEach(
      (enemy) => {
        enemy.destroy();
      },
    );

    this.bossProjectiles.forEach(
      (projectile) => {
        projectile.destroy();
      },
    );

    this.projectiles = [];
    this.enemies = [];
    this.bossProjectiles = [];
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

    this.statsManager.recordShot();
  }

  private spawnEnemy(
    x: number,
    pattern: EnemyPattern,
    type: EnemyType,
  ) {
    if (
      this.isGameOver ||
      this.isStageClear ||
      this.isGameComplete
    ) {
      return;
    }

    const enemy =
      new Enemy(
        this,
        x,
        -16,
        pattern,
        type,
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
      this.isGameComplete ||
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

            this.statsManager.recordHit();
            this.statsManager.recordEnemyDefeated();

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

        this.statsManager.recordHit();

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

    this.uiManager.updateLives(
      this.lives,
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
        if (
          this.isGameOver ||
          this.isStageClear ||
          this.isGameComplete
        ) {
          return;
        }

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
    this.isBossActive = false;

    this.isPlayerRespawning = false;
    this.isPlayerInvulnerable = false;

    this.physics.pause();

    this.player.setVelocity(
      0,
      0,
    );

    this.player.setVisible(false);

    const body =
      this.player
        .body as Phaser.Physics.Arcade.Body;

    body.enable = false;

    this.clearStageObjects();

    this.boss?.destroy();
    this.boss = undefined;

    this.destroyBossHealthBar();

    this.uiManager.showGameOver(
      () => {
        if (!this.isGameOver) {
          return;
        }

        this.showStageResults(
          "GAME OVER",
        );
      },
    );
  }

  private addScore(
    points: number,
  ) {
    this.statsManager.addScore(
      points,
    );

    this.uiManager.updateScore(
      this.statsManager.getScore(),
    );
  }

  private handleWavesComplete() {
    if (
      this.isGameOver ||
      this.isStageClear ||
      this.isGameComplete
    ) {
      return;
    }

    this.uiManager.showBossWarning(
      () => {
        if (
          this.isGameOver ||
          this.isStageClear ||
          this.isGameComplete
        ) {
          return;
        }

        this.spawnBoss();
      },
    );
  }

  private spawnBoss() {
    if (
      this.isGameOver ||
      this.isStageClear ||
      this.isGameComplete
    ) {
      return;
    }

    this.isBossActive = true;

    this.uiManager.setWaveLabel(
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

  private destroyBossHealthBar() {
    this.bossHealthBar?.destroy();
    this.bossHealthBarBackground?.destroy();

    this.bossHealthBar = undefined;
    this.bossHealthBarBackground = undefined;
  }

  private defeatBoss() {
    if (!this.boss) {
      return;
    }

    this.isBossActive = false;

    this.boss.destroy();
    this.boss = undefined;

    this.bossProjectiles.forEach(
      (projectile) => {
        projectile.destroy();
      },
    );

    this.bossProjectiles = [];

    this.destroyBossHealthBar();

    this.addScore(
      BOSS_SCORE,
    );

    this.stageClear();
  }

  private stageClear() {
    this.isStageClear = true;

    this.isPlayerRespawning = false;
    this.isPlayerInvulnerable = false;

    this.player.setVelocity(
      0,
      0,
    );

    this.player.setVisible(false);

    const body =
      this.player
        .body as Phaser.Physics.Arcade.Body;

    body.enable = false;

    this.projectiles.forEach(
      (projectile) => {
        projectile.destroy();
      },
    );

    this.projectiles = [];

    this.uiManager.showStageClear(
      this.currentStage,
      () => {
        if (!this.isStageClear) {
          return;
        }

        this.showStageResults(
          `STAGE ${this.currentStage
            .toString()
            .padStart(2, "0")} CLEAR`,
        );
      },
    );
  }

  private showStageResults(
    title: string,
  ) {
    this.isResultsVisible = true;

    this.player.setVisible(false);

    const body =
      this.player
        .body as Phaser.Physics.Arcade.Body;

    body.enable = false;

    this.uiManager.showResults({
      title,

      score:
        this.statsManager.getScore(),

      enemiesDefeated:
        this.statsManager
          .getEnemiesDefeated(),

      shotsFired:
        this.statsManager
          .getShotsFired(),

      hits:
        this.statsManager.getHits(),

      accuracy:
        this.statsManager
          .getAccuracy(),
    });
  }

  private showGameComplete() {
    this.uiManager.hideResults();

    this.isResultsVisible = false;
    this.isStageClear = false;
    this.isGameComplete = true;

    this.player.setVelocity(
      0,
      0,
    );

    this.player.setVisible(false);

    const body =
      this.player
        .body as Phaser.Physics.Arcade.Body;

    body.enable = false;

    this.uiManager.showGameComplete(
      this.statsManager.getScore(),
    );
  }
}