import Phaser from "phaser";

import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { Boss } from "../entities/Boss";
import { BossProjectile } from "../entities/BossProjectile";
import { GraterProjectile } from "../entities/GraterProjectile";

import { InputManager } from "../input/InputManager";
import { WaveManager } from "../systems/WaveManager";
import { StatsManager } from "../systems/StatsManager";
import { PowerUpManager } from "../systems/PowerUpManager";
import { ShootingManager } from "../systems/ShootingManager";
import { HitEffectManager } from "../systems/HitEffectManager";
import { GameUI } from "../ui/GameUI";

import { createClassicBoxTexture } from "../entities/createClassicBoxTexture";
import { createSpaghettiShotTexture } from "../entities/createSpaghettiShotTexture";
import { createTomatoEnemyTexture } from "../entities/createTomatoEnemyTexture";
import { createForkEnemyTexture } from "../entities/createForkEnemyTexture";
import { createGraterEnemyTexture } from "../entities/createGraterEnemyTexture";
import { createCheeseShardTexture } from "../entities/createCheeseShardTexture";
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
  private powerUpManager!: PowerUpManager;
  private shootingManager!: ShootingManager;
  private hitEffectManager!: HitEffectManager;
  private uiManager!: GameUI;

  private enemies: Enemy[] = [];
  private bossProjectiles: BossProjectile[] = [];
  private graterProjectiles: GraterProjectile[] = [];

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
    this.powerUpManager = new PowerUpManager(this);

    this.shootingManager = new ShootingManager(
      this,
      () => this.statsManager.recordShot(),
    );

    this.hitEffectManager = new HitEffectManager(this);
    this.uiManager = new GameUI(this);

    this.lives = 3;
    this.currentStage = 1;

    this.enemies = [];
    this.bossProjectiles = [];
    this.graterProjectiles = [];

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
    createCheeseShardTexture(this);

    createBossTexture(this);
    createBossProjectileTexture(this);

    this.inputManager = new InputManager(this);

    this.player = new Player(
      this,
      PLAYER_START_X,
      PLAYER_START_Y,
      this.inputManager,
    );

    this.powerUpManager.setPlayer(
      this.player,
    );

    this.uiManager.createHud(
      this.statsManager.getScore(),
      this.lives,
    );

    this.updateComboHud();

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

    if (this.statsManager.updateCombo(time)) {
      this.updateComboHud();
    }

    if (!this.isPlayerRespawning) {
      this.player.update();

      this.shootingManager.update(
        time,
        this.player,
        this.inputManager,
        this.powerUpManager.isRapidFireActive(),
        this.powerUpManager.isSpreadShotActive(),
        this.powerUpManager.isParmesanActive(),
      );
    }

    this.enemies.forEach((enemy) => {
      enemy.update(
        time,
        this.player.x,
        this.player.y,
        (
          x: number,
          y: number,
          targetX: number,
          targetY: number,
        ) => {
          this.spawnGraterProjectile(
            x,
            y,
            targetX,
            targetY,
          );
        },
      );
    });

    this.bossProjectiles.forEach(
      (projectile) => projectile.update(),
    );

    this.graterProjectiles.forEach(
      (projectile) => projectile.update(),
    );

    this.powerUpManager.update();

    if (this.boss?.active) {
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

    this.checkProjectileEnemyCollisions(time);
    this.checkProjectileBossCollisions();
    this.checkEnemyPlayerCollisions();
    this.checkBossProjectilePlayerCollisions();
    this.checkGraterProjectilePlayerCollisions();
    this.checkPowerUpPlayerCollisions();

    this.enemies = this.enemies.filter(
      (enemy) => enemy.active,
    );

    this.bossProjectiles = this.bossProjectiles.filter(
      (projectile) => projectile.active,
    );

    this.graterProjectiles = this.graterProjectiles.filter(
      (projectile) => projectile.active,
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
        speedMultiplier: number,
      ) => {
        this.spawnEnemy(
          x,
          pattern,
          type,
          speedMultiplier,
        );
      },

      (waveNumber: number) => {
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
    this.updateComboHud();

    this.clearStageObjects();

    this.boss = undefined;

    this.destroyBossHealthBar();

    this.player.setPosition(
      PLAYER_START_X,
      PLAYER_START_Y,
    );

    this.player.setVisible(true);
    this.player.setAlpha(1);
    this.player.setVelocity(0, 0);

    const body =
      this.player.body as Phaser.Physics.Arcade.Body;

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
    this.enemies.forEach(
      (enemy) => enemy.destroy(),
    );

    this.bossProjectiles.forEach(
      (projectile) => projectile.destroy(),
    );

    this.graterProjectiles.forEach(
      (projectile) => projectile.destroy(),
    );

    this.shootingManager.clear();
    this.powerUpManager.clear();

    this.enemies = [];
    this.bossProjectiles = [];
    this.graterProjectiles = [];
  }

  private spawnEnemy(
    x: number,
    pattern: EnemyPattern,
    type: EnemyType,
    speedMultiplier: number,
  ) {
    if (
      this.isGameOver ||
      this.isStageClear ||
      this.isGameComplete
    ) {
      return;
    }

    this.enemies.push(
      new Enemy(
        this,
        x,
        -16,
        pattern,
        type,
        speedMultiplier,
      ),
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

    this.bossProjectiles.push(
      new BossProjectile(
        this,
        x,
        y,
        velocityX,
        velocityY,
      ),
    );
  }

  private spawnGraterProjectile(
    x: number,
    y: number,
    targetX: number,
    targetY: number,
  ) {
    if (
      this.isGameOver ||
      this.isStageClear ||
      this.isGameComplete
    ) {
      return;
    }

    this.graterProjectiles.push(
      new GraterProjectile(
        this,
        x,
        y,
        targetX,
        targetY,
      ),
    );
  }

  private checkProjectileEnemyCollisions(
    time: number,
  ) {
    const projectiles =
      this.shootingManager.getProjectiles();

    projectiles.forEach((projectile) => {
      this.enemies.forEach((enemy) => {
        if (
          !projectile.active ||
          !enemy.active
        ) {
          return;
        }

        if (
          !this.physics.overlap(
            projectile,
            enemy,
          )
        ) {
          return;
        }

        const { x, y } = enemy;

        const damage =
          this.shootingManager.getProjectileDamage(
            projectile,
          );

        projectile.destroy();

        this.statsManager.recordHit();

        const enemyDefeated =
          enemy.takeDamage(
            damage,
          );

        if (!enemyDefeated) {
          return;
        }

        this.statsManager.recordEnemyDefeated(
          time,
        );

        this.addComboScore(100);
        this.updateComboHud();

        this.powerUpManager.trySpawn(
          x,
          y,
        );
      });
    });
  }

  private checkProjectileBossCollisions() {
    if (
      !this.boss?.active ||
      !this.isBossActive
    ) {
      return;
    }

    const projectiles =
      this.shootingManager.getProjectiles();

    projectiles.forEach((projectile) => {
      if (!projectile.active) return;

      if (
        !this.physics.overlap(
          projectile,
          this.boss!,
        )
      ) {
        return;
      }

      const damage =
        this.shootingManager.getProjectileDamage(
          projectile,
        );

      projectile.destroy();

      this.statsManager.recordHit();

      const bossDefeated =
        this.boss!.takeDamage(
          damage,
        );

      this.updateBossHealthBar();

      if (bossDefeated) {
        this.defeatBoss();
      }
    });
  }

  private checkEnemyPlayerCollisions() {
    if (
      this.isPlayerInvulnerable ||
      this.isPlayerRespawning
    ) {
      return;
    }

    this.enemies.forEach((enemy) => {
      if (!enemy.active) return;

      if (
        !this.physics.overlap(
          this.player,
          enemy,
        )
      ) {
        return;
      }

      enemy.destroy();
      this.damagePlayer();
    });
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
        if (!projectile.active) return;

        if (
          !this.physics.overlap(
            this.player,
            projectile,
          )
        ) {
          return;
        }

        projectile.destroy();
        this.damagePlayer();
      },
    );
  }

  private checkGraterProjectilePlayerCollisions() {
    if (
      this.isPlayerInvulnerable ||
      this.isPlayerRespawning
    ) {
      return;
    }

    this.graterProjectiles.forEach(
      (projectile) => {
        if (!projectile.active) return;

        if (
          !this.physics.overlap(
            this.player,
            projectile,
          )
        ) {
          return;
        }

        projectile.destroy();
        this.damagePlayer();
      },
    );
  }

  private checkPowerUpPlayerCollisions() {
    if (
      this.isPlayerRespawning ||
      this.isGameOver ||
      this.isStageClear ||
      this.isGameComplete
    ) {
      return;
    }

    this.powerUpManager
      .getActivePowerUps()
      .forEach((powerUp) => {
        if (!powerUp.active) return;

        if (
          !this.physics.overlap(
            this.player,
            powerUp,
          )
        ) {
          return;
        }

        this.powerUpManager.activatePowerUp(
          powerUp.getPowerUpType(),
        );

        this.powerUpManager.removePowerUp(
          powerUp,
        );
      });
  }

  private damagePlayer() {
    if (
      this.powerUpManager.consumeShield()
    ) {
      return;
    }

    this.statsManager.resetCombo();
    this.updateComboHud();

    this.hitEffectManager.play(
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

    this.player.setVelocity(0, 0);
    this.player.setVisible(false);

    const body =
      this.player.body as Phaser.Physics.Arcade.Body;

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

  private gameOver() {
    this.isGameOver = true;
    this.isBossActive = false;

    this.isPlayerRespawning = false;
    this.isPlayerInvulnerable = false;

    this.physics.pause();

    this.player.setVelocity(0, 0);
    this.player.setVisible(false);

    const body =
      this.player.body as Phaser.Physics.Arcade.Body;

    body.enable = false;

    this.clearStageObjects();

    this.boss?.destroy();
    this.boss = undefined;

    this.destroyBossHealthBar();

    this.uiManager.showGameOver(
      () => {
        if (!this.isGameOver) return;

        this.showStageResults(
          "GAME OVER",
        );
      },
    );
  }

  private addScore(points: number) {
    this.statsManager.addScore(
      points,
    );

    this.uiManager.updateScore(
      this.statsManager.getScore(),
    );
  }

  private addComboScore(points: number) {
    this.statsManager.addComboScore(
      points,
    );

    this.uiManager.updateScore(
      this.statsManager.getScore(),
    );
  }

  private updateComboHud() {
    this.uiManager.updateCombo(
      this.statsManager.getCombo(),
      this.statsManager.getMultiplier(),
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

    this.boss = new Boss(
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
    if (!this.boss) return;

    this.isBossActive = false;

    this.boss.destroy();
    this.boss = undefined;

    this.bossProjectiles.forEach(
      (projectile) => projectile.destroy(),
    );

    this.graterProjectiles.forEach(
      (projectile) => projectile.destroy(),
    );

    this.bossProjectiles = [];
    this.graterProjectiles = [];

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

    this.player.setVelocity(0, 0);
    this.player.setVisible(false);

    const body =
      this.player.body as Phaser.Physics.Arcade.Body;

    body.enable = false;

    this.shootingManager.clear();
    this.powerUpManager.clear();

    this.uiManager.showStageClear(
      this.currentStage,
      () => {
        if (!this.isStageClear) return;

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
      this.player.body as Phaser.Physics.Arcade.Body;

    body.enable = false;

    this.uiManager.showResults({
      title,
      score:
        this.statsManager.getScore(),
      enemiesDefeated:
        this.statsManager.getEnemiesDefeated(),
      shotsFired:
        this.statsManager.getShotsFired(),
      hits:
        this.statsManager.getHits(),
      accuracy:
        this.statsManager.getAccuracy(),
    });
  }

  private showGameComplete() {
    this.uiManager.hideResults();

    this.isResultsVisible = false;
    this.isStageClear = false;
    this.isGameComplete = true;

    this.shootingManager.clear();
    this.powerUpManager.clear();

    this.player.setVelocity(0, 0);
    this.player.setVisible(false);

    const body =
      this.player.body as Phaser.Physics.Arcade.Body;

    body.enable = false;

    this.uiManager.showGameComplete(
      this.statsManager.getScore(),
    );
  }
}