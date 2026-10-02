import Phaser from "phaser";

import { Player } from "../entities/player/Player";
import { Enemy } from "../entities/enemies/Enemy";

import { Boss } from "../entities/bosses/sauce-king/Boss";
import { PastaMachineBoss } from "../entities/bosses/pasta-machine/PastaMachineBoss";

import { BossProjectile } from "../entities/bosses/sauce-king/BossProjectile";
import { GraterProjectile } from "../entities/enemies/stage1/GraterProjectile";
import { ColanderProjectile } from "../entities/enemies/stage1/ColanderProjectile";
import { PepperProjectile } from "../entities/enemies/stage2/PepperProjectile";
import { DoughStripProjectile } from "../entities/bosses/pasta-machine/DoughStripProjectile";

import { BoilingWaterHazard } from "../entities/enemies/stage2/BoilingWaterHazard";
import { RollingPinTrailHazard } from "../entities/enemies/stage2/RollingPinTrailHazard";
import { PastaRollerLaneHazard } from "../entities/bosses/pasta-machine/PastaRollerLaneHazard";

import { InputManager } from "../input/InputManager";
import { WaveManager } from "../systems/WaveManager";
import { StatsManager } from "../systems/StatsManager";
import { PowerUpManager } from "../systems/PowerUpManager";
import { ShootingManager } from "../systems/ShootingManager";
import { HitEffectManager } from "../systems/HitEffectManager";
import { StarfieldManager } from "../systems/StarfieldManager";
import { GameUI } from "../ui/GameUI";

import { TOTAL_STAGES } from "../config/progressionConfig";

import { createClassicBoxTexture } from "../entities/player/createClassicBoxTexture";
import { createSpaghettiShotTexture } from "../entities/player/createSpaghettiShotTexture";

import { createTomatoEnemyTexture } from "../entities/enemies/stage1/createTomatoEnemyTexture";
import { createForkEnemyTexture } from "../entities/enemies/stage1/createForkEnemyTexture";
import { createGraterEnemyTexture } from "../entities/enemies/stage1/createGraterEnemyTexture";
import { createBasilEnemyTexture } from "../entities/enemies/stage1/createBasilEnemyTexture";
import { createColanderEnemyTexture } from "../entities/enemies/stage1/createColanderEnemyTexture";

import { createRavioliEnemyTexture } from "../entities/enemies/stage2/createRavioliEnemyTexture";
import { createPepperGrinderEnemyTexture } from "../entities/enemies/stage2/createPepperGrinderEnemyTexture";
import { createMeatballEnemyTexture } from "../entities/enemies/stage2/createMeatballEnemyTexture";
import { createPastaPotEnemyTexture } from "../entities/enemies/stage2/createPastaPotEnemyTexture";
import { createRollingPinEnemyTexture } from "../entities/enemies/stage2/createRollingPinEnemyTexture";

import { createCheeseShardTexture } from "../entities/enemies/stage1/createCheeseShardTexture";
import { createColanderProjectileTexture } from "../entities/enemies/stage1/createColanderProjectileTexture";
import { createPepperProjectileTexture } from "../entities/enemies/stage2/createPepperProjectileTexture";
import { createBoilingWaterTexture } from "../entities/enemies/stage2/createBoilingWaterTexture";
import { createRollingPinTrailTexture } from "../entities/enemies/stage2/createRollingPinTrailTexture";

import { createBossTexture } from "../entities/bosses/sauce-king/createBossTexture";
import { createBossProjectileTexture } from "../entities/bosses/sauce-king/createBossProjectileTexture";

import { createPastaMachineBossTexture } from "../entities/bosses/pasta-machine/createPastaMachineBossTexture";
import { createDoughStripTexture } from "../entities/bosses/pasta-machine/createDoughStripTexture";
import { createPastaRollerTexture } from "../entities/bosses/pasta-machine/createPastaRollerTexture";

import type { EnemyPattern, EnemyType } from "../types";

const PLAYER_START_X = 112;
const PLAYER_START_Y = 245;

const RESPAWN_DELAY = 500;
const BOSS_SCORE = 2000;

const INITIAL_LIVES = 10;
const INITIAL_STAGE = 2;

export class GameScene extends Phaser.Scene {
  private player!: Player;

  private inputManager!: InputManager;
  private waveManager!: WaveManager;
  private statsManager!: StatsManager;
  private powerUpManager!: PowerUpManager;
  private shootingManager!: ShootingManager;
  private hitEffectManager!: HitEffectManager;
  private starfieldManager!: StarfieldManager;
  private uiManager!: GameUI;

  private enemies: Enemy[] = [];

  private bossProjectiles: BossProjectile[] = [];
  private graterProjectiles: GraterProjectile[] = [];
  private colanderProjectiles: ColanderProjectile[] = [];
  private pepperProjectiles: PepperProjectile[] = [];
  private doughStripProjectiles: DoughStripProjectile[] = [];

  private boilingWaterHazards: BoilingWaterHazard[] = [];
  private rollingPinTrails: RollingPinTrailHazard[] = [];
  private pastaRollerLaneHazards: PastaRollerLaneHazard[] = [];

  private boss?: Boss | PastaMachineBoss;

  private bossHealthBarBackground?: Phaser.GameObjects.Graphics;
  private bossHealthBar?: Phaser.GameObjects.Graphics;

  private lives = INITIAL_LIVES;
  private currentStage = INITIAL_STAGE;

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
    this.cameras.main.setBackgroundColor("#081a3a");

    this.statsManager = new StatsManager();
    this.powerUpManager = new PowerUpManager(this);

    this.shootingManager = new ShootingManager(
      this,
      () => this.statsManager.recordShot(),
    );

    this.hitEffectManager = new HitEffectManager(this);
    this.uiManager = new GameUI(this);

    this.starfieldManager = new StarfieldManager(this);
    this.starfieldManager.create();

    this.resetGameState();
    this.createTextures();

    this.inputManager = new InputManager(this);

    this.player = new Player(
      this,
      PLAYER_START_X,
      PLAYER_START_Y,
      this.inputManager,
    );

    this.powerUpManager.setPlayer(this.player);

    this.uiManager.createHud(
      this.statsManager.getScore(),
      this.lives,
    );

    this.updateComboHud();
    this.startStage();

    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => this.starfieldManager.destroy(),
    );
  }

  update(time: number, delta: number) {
    this.starfieldManager.update(delta);

    if (this.handleFinishedState()) return;

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
        (x, y, targetX, targetY) => {
          this.spawnGraterProjectile(
            x,
            y,
            targetX,
            targetY,
          );
        },
        (x, y) => {
          this.spawnColanderBurst(x, y);
        },
        (x, y, velocityX, velocityY) => {
          this.spawnPepperProjectile(
            x,
            y,
            velocityX,
            velocityY,
          );
        },
        () => {
          this.spawnBoilingWaterHazard(enemy);
        },
        (y) => {
          this.spawnRollingPinTrail(y);
        },
      );
    });

    this.updateEnemyProjectiles();
    this.powerUpManager.update();
    this.updateBoss(time);

    this.checkProjectileEnemyCollisions(time);
    this.checkProjectileBossCollisions();

    this.checkEnemyPlayerCollisions();
    this.checkHostileProjectilePlayerCollisions();
    this.checkPowerUpPlayerCollisions();

    this.cleanupInactiveObjects();

    this.waveManager.update(this.enemies.length);
  }

  private resetGameState() {
    this.lives = INITIAL_LIVES;
    this.currentStage = INITIAL_STAGE;

    this.enemies = [];

    this.bossProjectiles = [];
    this.graterProjectiles = [];
    this.colanderProjectiles = [];
    this.pepperProjectiles = [];
    this.doughStripProjectiles = [];

    this.boilingWaterHazards = [];
    this.rollingPinTrails = [];
    this.pastaRollerLaneHazards = [];

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
  }

  private createTextures() {
    createClassicBoxTexture(this);
    createSpaghettiShotTexture(this);

    createTomatoEnemyTexture(this);
    createForkEnemyTexture(this);
    createGraterEnemyTexture(this);
    createBasilEnemyTexture(this);
    createColanderEnemyTexture(this);

    createRavioliEnemyTexture(this);
    createPepperGrinderEnemyTexture(this);
    createMeatballEnemyTexture(this);
    createPastaPotEnemyTexture(this);
    createRollingPinEnemyTexture(this);

    createCheeseShardTexture(this);
    createColanderProjectileTexture(this);
    createPepperProjectileTexture(this);
    createBoilingWaterTexture(this);
    createRollingPinTrailTexture(this);

    createBossTexture(this);
    createBossProjectileTexture(this);

    createPastaMachineBossTexture(this);
    createDoughStripTexture(this);
    createPastaRollerTexture(this);
  }

  private handleFinishedState() {
    if (this.isGameComplete) {
      if (this.inputManager.isStartPressed()) {
        this.scene.restart();
      }

      return true;
    }

    if (this.isGameOver) {
      if (
        this.isResultsVisible &&
        this.inputManager.isStartPressed()
      ) {
        this.scene.restart();
      }

      return true;
    }

    if (!this.isStageClear) {
      return false;
    }

    if (
      this.isResultsVisible &&
      this.inputManager.isStartPressed()
    ) {
      if (this.currentStage < TOTAL_STAGES) {
        this.startNextStage();
      } else {
        this.showGameComplete();
      }
    }

    return true;
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
        this.uiManager.updateWave(waveNumber);
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

    this.uiManager.updateLives(this.lives);

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
    this.enemies.forEach((enemy) => enemy.destroy());

    this.clearEnemyProjectiles();
    this.shootingManager.clear();
    this.powerUpManager.clear();

    this.enemies = [];
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

  private spawnColanderBurst(
    x: number,
    y: number,
  ) {
    if (
      this.isGameOver ||
      this.isStageClear ||
      this.isGameComplete
    ) {
      return;
    }

    const shots = [
      { velocityX: -45, velocityY: 105 },
      { velocityX: 0, velocityY: 120 },
      { velocityX: 45, velocityY: 105 },
    ];

    shots.forEach(({ velocityX, velocityY }) => {
      this.colanderProjectiles.push(
        new ColanderProjectile(
          this,
          x,
          y,
          velocityX,
          velocityY,
        ),
      );
    });
  }

  private spawnPepperProjectile(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
  ) {
    if (
      this.isGameOver ||
      this.isStageClear ||
      this.isGameComplete
    ) {
      return;
    }

    this.pepperProjectiles.push(
      new PepperProjectile(
        this,
        x,
        y,
        velocityX,
        velocityY,
      ),
    );
  }

  private spawnBoilingWaterHazard(
    owner: Phaser.Physics.Arcade.Sprite,
  ) {
    if (
      this.isGameOver ||
      this.isStageClear ||
      this.isGameComplete
    ) {
      return;
    }

    this.boilingWaterHazards.push(
      new BoilingWaterHazard(
        this,
        owner,
      ),
    );
  }

  private spawnRollingPinTrail(y: number) {
    if (
      this.isGameOver ||
      this.isStageClear ||
      this.isGameComplete
    ) {
      return;
    }

    this.rollingPinTrails.push(
      new RollingPinTrailHazard(
        this,
        y,
      ),
    );
  }

  private spawnDoughStrip(
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

    this.doughStripProjectiles.push(
      new DoughStripProjectile(
        this,
        x,
        y,
        velocityX,
        velocityY,
      ),
    );
  }

  private spawnPastaRollerLane(
    x: number,
  ) {
    if (
      this.isGameOver ||
      this.isStageClear ||
      this.isGameComplete ||
      !this.isBossActive
    ) {
      return;
    }

    this.pastaRollerLaneHazards.push(
      new PastaRollerLaneHazard(
        this,
        x,
      ),
    );
  }

  private updateEnemyProjectiles() {
    this.bossProjectiles.forEach(
      (projectile) => projectile.update(),
    );

    this.graterProjectiles.forEach(
      (projectile) => projectile.update(),
    );

    this.colanderProjectiles.forEach(
      (projectile) => projectile.update(),
    );

    this.pepperProjectiles.forEach(
      (projectile) => projectile.update(),
    );

    this.doughStripProjectiles.forEach(
      (projectile) => projectile.update(),
    );

    this.boilingWaterHazards.forEach(
      (hazard) => hazard.update(),
    );

    this.pastaRollerLaneHazards.forEach(
      (hazard) => hazard.update(),
    );
  }

  private updateBoss(time: number) {
    if (
      !this.boss?.active ||
      !this.isBossActive
    ) {
      return;
    }

    if (
      this.boss instanceof PastaMachineBoss
    ) {
      this.boss.update(
        time,
        this.player.x,
        (
          x,
          y,
          velocityX,
          velocityY,
        ) => {
          this.spawnDoughStrip(
            x,
            y,
            velocityX,
            velocityY,
          );
        },
        (laneX) => {
          this.spawnPastaRollerLane(
            laneX,
          );
        },
      );

      return;
    }

    this.boss.update(
      time,
      this.player.x,
      this.player.y,
      (
        x,
        y,
        velocityX,
        velocityY,
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

  private cleanupInactiveObjects() {
    this.enemies =
      this.enemies.filter(
        (enemy) => enemy.active,
      );

    this.bossProjectiles =
      this.bossProjectiles.filter(
        (projectile) => projectile.active,
      );

    this.graterProjectiles =
      this.graterProjectiles.filter(
        (projectile) => projectile.active,
      );

    this.colanderProjectiles =
      this.colanderProjectiles.filter(
        (projectile) => projectile.active,
      );

    this.pepperProjectiles =
      this.pepperProjectiles.filter(
        (projectile) => projectile.active,
      );

    this.doughStripProjectiles =
      this.doughStripProjectiles.filter(
        (projectile) => projectile.active,
      );

    this.boilingWaterHazards =
      this.boilingWaterHazards.filter(
        (hazard) => hazard.active,
      );

    this.rollingPinTrails =
      this.rollingPinTrails.filter(
        (trail) => trail.active,
      );

    this.pastaRollerLaneHazards =
      this.pastaRollerLaneHazards.filter(
        (hazard) => hazard.active,
      );
  }

  private clearEnemyProjectiles() {
    this.bossProjectiles.forEach(
      (projectile) => projectile.destroy(),
    );

    this.graterProjectiles.forEach(
      (projectile) => projectile.destroy(),
    );

    this.colanderProjectiles.forEach(
      (projectile) => projectile.destroy(),
    );

    this.pepperProjectiles.forEach(
      (projectile) => projectile.destroy(),
    );

    this.doughStripProjectiles.forEach(
      (projectile) => projectile.destroy(),
    );

    this.boilingWaterHazards.forEach(
      (hazard) => hazard.destroy(),
    );

    this.rollingPinTrails.forEach(
      (trail) => trail.destroy(),
    );

    this.pastaRollerLaneHazards.forEach(
      (hazard) => hazard.destroy(),
    );

    this.bossProjectiles = [];
    this.graterProjectiles = [];
    this.colanderProjectiles = [];
    this.pepperProjectiles = [];
    this.doughStripProjectiles = [];

    this.boilingWaterHazards = [];
    this.rollingPinTrails = [];
    this.pastaRollerLaneHazards = [];
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
          enemy.takeDamage(damage);

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
      if (
        !projectile.active ||
        !this.boss?.active ||
        !this.isBossActive
      ) {
        return;
      }

      if (
        !this.physics.overlap(
          projectile,
          this.boss,
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
        this.boss.takeDamage(damage);

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

    for (const enemy of this.enemies) {
      if (
        !enemy.active ||
        !this.physics.overlap(
          this.player,
          enemy,
        )
      ) {
        continue;
      }

      enemy.destroy();
      this.damagePlayer();

      return;
    }
  }

  private checkHostileProjectilePlayerCollisions() {
    if (
      this.isPlayerInvulnerable ||
      this.isPlayerRespawning
    ) {
      return;
    }

    const destructibleHazards:
      Phaser.Physics.Arcade.Sprite[] = [
        ...this.bossProjectiles,
        ...this.graterProjectiles,
        ...this.colanderProjectiles,
        ...this.pepperProjectiles,
        ...this.doughStripProjectiles,
        ...this.boilingWaterHazards,
      ];

    for (
      const hazard of
      destructibleHazards
    ) {
      if (
        !hazard.active ||
        !this.physics.overlap(
          this.player,
          hazard,
        )
      ) {
        continue;
      }

      hazard.destroy();
      this.damagePlayer();

      return;
    }

    for (
      const trail of
      this.rollingPinTrails
    ) {
      if (
        !trail.active ||
        !this.physics.overlap(
          this.player,
          trail,
        )
      ) {
        continue;
      }

      this.damagePlayer();
      return;
    }

    for (
      const roller of
      this.pastaRollerLaneHazards
    ) {
      if (
        !roller.active ||
        !this.physics.overlap(
          this.player,
          roller,
        )
      ) {
        continue;
      }

      this.damagePlayer();
      return;
    }
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
        if (
          !powerUp.active ||
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

    if (
      this.lives <= 0
    ) {
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

  private addComboScore(
    points: number,
  ) {
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

    if (
      this.currentStage === 2
    ) {
      this.boss =
        new PastaMachineBoss(
          this,
          112,
          55,
        );
    } else {
      this.boss =
        new Boss(
          this,
          112,
          55,
        );
    }

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

    this.clearEnemyProjectiles();
    this.destroyBossHealthBar();

    this.addScore(BOSS_SCORE);
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
        if (
          !this.isStageClear
        ) {
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