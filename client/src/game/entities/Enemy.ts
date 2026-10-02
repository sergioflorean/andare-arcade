import Phaser from "phaser";

import type { EnemyPattern, EnemyType } from "../types";

const TEXTURE_KEYS: Record<EnemyType, string> = {
  tomato: "tomato-enemy",
  fork: "fork-enemy",
  grater: "grater-enemy",
  basil: "basil-enemy",
  colander: "colander-enemy",
  ravioli: "ravioli-enemy",
  "pepper-grinder": "pepper-grinder-enemy",
  meatball: "meatball-enemy",
  "pasta-pot": "pasta-pot",
  "rolling-pin": "rolling-pin-enemy",
};

const MAX_HEALTH: Record<EnemyType, number> = {
  tomato: 1,
  fork: 1,
  grater: 3,
  basil: 1,
  colander: 6,
  ravioli: 2,
  "pepper-grinder": 3,
  meatball: 3,
  "pasta-pot": 4,
  "rolling-pin": 4,
};

const VERTICAL_SPEEDS: Record<EnemyType, number> = {
  tomato: 40,
  fork: 65,
  grater: 45,
  basil: 78,
  colander: 28,
  ravioli: 42,
  "pepper-grinder": 32,
  meatball: 18,
  "pasta-pot": 24,
  "rolling-pin": 48,
};

const ZIGZAG_SPEEDS: Record<EnemyType, number> = {
  tomato: 55,
  fork: 45,
  grater: 85,
  basil: 110,
  colander: 36,
  ravioli: 38,
  "pepper-grinder": 40,
  meatball: 40,
  "pasta-pot": 30,
  "rolling-pin": 0,
};

const FORK_DIVE_TRIGGER_Y = 70;
const FORK_TELEGRAPH_DURATION = 350;
const FORK_DIVE_SPEED = 180;

const GRATER_ATTACK_TRIGGER_Y = 75;
const GRATER_TELEGRAPH_DURATION = 450;
const GRATER_SCALE = 1.45;
const GRATER_HORIZONTAL_SPEED = 70;
const GRATER_ROAM_SPEED = 26;
const GRATER_RETREAT_SPEED = 75;
const GRATER_RETREAT_DURATION = 550;
const GRATER_RETREAT_MIN_DELAY = 700;
const GRATER_RETREAT_MAX_DELAY = 1300;
const GRATER_MAX_RETREATS = 2;
const GRATER_MIN_X = 22;
const GRATER_MAX_X = 202;
const GRATER_DAMAGED_TINT = 0xc2ad8a;
const GRATER_SMOKE_COLOR = 0x777777;

const BASIL_HORIZONTAL_SPEED = 105;
const BASIL_MIN_X = 18;
const BASIL_MAX_X = 206;

const COLANDER_SCALE = 1.35;
const COLANDER_ROAM_Y = 62;
const COLANDER_HORIZONTAL_SPEED = 48;
const COLANDER_MIN_X = 30;
const COLANDER_MAX_X = 194;
const COLANDER_FIRST_SHOT_DELAY = 900;
const COLANDER_SHOT_INTERVAL = 1800;
const COLANDER_TELEGRAPH_DURATION = 300;
const COLANDER_TELEGRAPH_TINT = 0x9ed7df;

const RAVIOLI_SCALE = 0.9;
const RAVIOLI_TELEGRAPH_DURATION = 320;
const RAVIOLI_CHARGE_SPEED = 215;
const RAVIOLI_TELEGRAPH_TINT = 0xffc857;
const RAVIOLI_CRACKED_TEXTURE = "ravioli-enemy-cracked";
const RAVIOLI_OUT_OF_BOUNDS_MARGIN = 32;

const PEPPER_GRINDER_SCALE = 0.95;
const PEPPER_GRINDER_ROAM_Y = 58;
const PEPPER_GRINDER_HORIZONTAL_SPEED = 60;
const PEPPER_GRINDER_MIN_X = 18;
const PEPPER_GRINDER_MAX_X = 206;
const PEPPER_GRINDER_FIRST_ATTACK_DELAY = 500;
const PEPPER_GRINDER_ATTACK_INTERVAL = 1400;
const PEPPER_GRINDER_TELEGRAPH_DURATION = 280;
const PEPPER_GRINDER_TELEGRAPH_TINT = 0xffd34f;
const PEPPER_GRINDER_HIT_TINT = 0xffffff;

const PEPPER_PROJECTILE_COUNT = 4;
const PEPPER_BURST_DELAY = 55;
const PEPPER_SPAWN_OFFSET_X = 6;
const PEPPER_MIN_VELOCITY_X = -22;
const PEPPER_MAX_VELOCITY_X = 22;
const PEPPER_MIN_VELOCITY_Y = 125;
const PEPPER_MAX_VELOCITY_Y = 165;

const MEATBALL_SCALE = 1.55;
const MEATBALL_ORBIT_RADIUS = 22;
const MEATBALL_ORBIT_SPEED = 1.1;
const MEATBALL_DOWN_SPEED = 18;
const MEATBALL_HIT_TINT = 0xffd3b5;

const PASTA_POT_SCALE = 1.15;
const PASTA_POT_ROAM_Y = 72;
const PASTA_POT_HORIZONTAL_SPEED = 28;
const PASTA_POT_MIN_X = 28;
const PASTA_POT_MAX_X = 196;
const PASTA_POT_FIRST_POUR_DELAY = 700;
const PASTA_POT_POUR_INTERVAL = 2200;
const PASTA_POT_TELEGRAPH_DURATION = 500;
const PASTA_POT_TELEGRAPH_TINT = 0x71d5ef;
const PASTA_POT_HIT_TINT = 0xe7f2f4;

const ROLLING_PIN_SCALE = 1.2;
const ROLLING_PIN_ATTACK_Y = 110;
const ROLLING_PIN_SECOND_PASS_Y = 150;
const ROLLING_PIN_EDGE_X = 18;
const ROLLING_PIN_OFFSCREEN_MARGIN = 26;
const ROLLING_PIN_DASH_SPEED = 220;
const ROLLING_PIN_DASH_TIMEOUT = 1600;
const ROLLING_PIN_TELEGRAPH_DURATION = 450;
const ROLLING_PIN_TELEGRAPH_TINT = 0xff493d;
const ROLLING_PIN_HIT_TINT = 0xffd6bd;
const ROLLING_PIN_MAX_PASSES = 2;

type ForkState = "approach" | "telegraph" | "dive";

type GraterState =
  | "approach"
  | "telegraph"
  | "roam"
  | "retreat";

type ColanderState =
  | "approach"
  | "roam"
  | "telegraph";

type RavioliState =
  | "armored"
  | "broken"
  | "telegraph"
  | "charge";

type PepperGrinderState =
  | "approach"
  | "roam"
  | "telegraph";

type PastaPotState =
  | "approach"
  | "roam"
  | "telegraph";

type RollingPinState =
  | "approach"
  | "telegraph"
  | "dash";

type GraterShootCallback = (
  x: number,
  y: number,
  targetX: number,
  targetY: number,
) => void;

type ColanderShootCallback = (
  x: number,
  y: number,
) => void;

type PepperShootCallback = (
  x: number,
  y: number,
  velocityX: number,
  velocityY: number,
) => void;

type PastaPotPourCallback = (
  x: number,
  y: number,
) => void;

type RollingPinTrailCallback = (
  y: number,
) => void;

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private pattern: EnemyPattern;
  private enemyType: EnemyType;

  private health: number;
  private speedMultiplier: number;
  private zigzagPhase: number;

  private forkState: ForkState = "approach";
  private forkDiveTime = 0;

  private graterState: GraterState = "approach";
  private graterShootTime = 0;
  private graterRetreatAt = 0;
  private graterRetreatEndsAt = 0;
  private graterRetreats = 0;
  private isGraterDamaged = false;
  private isCriticalBlinking = false;
  private graterDamageSmoke?: Phaser.GameObjects.Graphics;

  private colanderState: ColanderState = "approach";
  private colanderShootAt = 0;
  private colanderTelegraphEndsAt = 0;

  private ravioliState: RavioliState = "armored";
  private ravioliChargeAt = 0;

  private pepperGrinderState: PepperGrinderState = "approach";
  private pepperAttackAt = 0;
  private pepperTelegraphEndsAt = 0;
  private pepperDirection: -1 | 1 =
    Math.random() < 0.5 ? -1 : 1;

  private pastaPotState: PastaPotState = "approach";
  private pastaPotPourAt = 0;
  private pastaPotTelegraphEndsAt = 0;
  private pastaPotDirection: -1 | 1 =
    Math.random() < 0.5 ? -1 : 1;

  private rollingPinState: RollingPinState = "approach";
  private rollingPinTelegraphEndsAt = 0;
  private rollingPinDashEndsAt = 0;
  private rollingPinPasses = 0;
  private rollingPinDirection: -1 | 1 =
    Math.random() < 0.5 ? -1 : 1;

  private targetX = 0;
  private targetY = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    pattern: EnemyPattern = "straight",
    type: EnemyType = "tomato",
    speedMultiplier = 1,
  ) {
    super(scene, x, y, TEXTURE_KEYS[type]);

    this.pattern = pattern;
    this.enemyType = type;
    this.health = MAX_HEALTH[type];
    this.speedMultiplier = speedMultiplier;

    this.zigzagPhase = Phaser.Math.FloatBetween(
      0,
      Math.PI * 2,
    );

    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (type === "grater") {
      this.setScale(GRATER_SCALE);
    }

    if (type === "colander") {
      this.setScale(COLANDER_SCALE);
    }

    if (type === "ravioli") {
      this.setScale(RAVIOLI_SCALE);
    }

    if (type === "pepper-grinder") {
      this.setScale(PEPPER_GRINDER_SCALE);
    }

    if (type === "meatball") {
      this.setScale(MEATBALL_SCALE);
    }

    if (type === "pasta-pot") {
      this.setScale(PASTA_POT_SCALE);
    }

    if (type === "rolling-pin") {
      this.setScale(ROLLING_PIN_SCALE);

      const startX =
        this.rollingPinDirection > 0
          ? ROLLING_PIN_EDGE_X
          : scene.scale.width - ROLLING_PIN_EDGE_X;

      this.resetPhysicsPosition(
        startX,
        y,
      );
    }

    this.once("destroy", () => {
      this.scene?.tweens.killTweensOf(this);

      this.graterDamageSmoke?.destroy();
      this.graterDamageSmoke = undefined;
    });

    this.setVelocityY(
      VERTICAL_SPEEDS[type] *
        speedMultiplier,
    );
  }

  update(
    time: number,
    playerX?: number,
    playerY?: number,
    onGraterShoot?: GraterShootCallback,
    onColanderShoot?: ColanderShootCallback,
    onPepperShoot?: PepperShootCallback,
    onPastaPotPour?: PastaPotPourCallback,
    onRollingPinTrail?: RollingPinTrailCallback,
  ) {
    if (this.enemyType === "ravioli") {
      this.updateRavioli(time);
    } else if (this.enemyType === "meatball") {
      this.updateMeatball(time);
    } else if (
      this.enemyType === "rolling-pin" &&
      onRollingPinTrail
    ) {
      this.updateRollingPin(
        time,
        onRollingPinTrail,
      );
    } else if (
      this.enemyType === "pasta-pot" &&
      onPastaPotPour
    ) {
      this.updatePastaPot(
        time,
        onPastaPotPour,
      );
    } else if (
      this.enemyType === "pepper-grinder" &&
      onPepperShoot
    ) {
      this.updatePepperGrinder(
        time,
        onPepperShoot,
      );
    } else if (this.enemyType === "basil") {
      this.updateBasil(time);
    } else if (
      this.enemyType === "colander" &&
      onColanderShoot
    ) {
      this.updateColander(
        time,
        onColanderShoot,
      );
    } else if (
      this.enemyType === "fork" &&
      playerX !== undefined &&
      playerY !== undefined
    ) {
      this.updateFork(
        time,
        playerX,
        playerY,
      );
    } else if (
      this.enemyType === "grater" &&
      playerX !== undefined &&
      playerY !== undefined &&
      onGraterShoot
    ) {
      this.updateGrater(
        time,
        playerX,
        playerY,
        onGraterShoot,
      );
    } else {
      this.updateNormalMovement(time);
    }

    if (!this.active) {
      return;
    }

    this.updateDamageVisual();

    if (
      this.y - this.height >
      this.scene.scale.height
    ) {
      this.destroy();
    }
  }

  takeDamage(damage = 1) {
    this.health -= damage;

    if (this.health <= 0) {
      this.destroy();
      return true;
    }

    if (
      this.enemyType === "ravioli" &&
      this.ravioliState === "armored"
    ) {
      this.breakRavioliArmor();
    }

    if (this.enemyType === "grater") {
      this.applyGraterDamagedState();

      if (this.health === 1) {
        this.startCriticalBlink();
      }
    }

    if (this.enemyType === "colander") {
      this.flashColanderHit();
    }

    if (this.enemyType === "pepper-grinder") {
      this.flashPepperGrinderHit();
    }

    if (this.enemyType === "meatball") {
      this.flashMeatballHit();
    }

    if (this.enemyType === "pasta-pot") {
      this.flashPastaPotHit();
    }

    if (this.enemyType === "rolling-pin") {
      this.flashRollingPinHit();
    }

    return false;
  }

  private updateNormalMovement(
    time: number,
  ) {
    this.setVelocityY(
      VERTICAL_SPEEDS[this.enemyType] *
        this.speedMultiplier,
    );

    if (this.pattern === "straight") {
      this.setVelocityX(0);
      return;
    }

    const direction = Math.sin(
      time / 250 +
        this.zigzagPhase,
    );

    this.setVelocityX(
      direction *
        ZIGZAG_SPEEDS[this.enemyType] *
        this.speedMultiplier,
    );
  }

  private updateRollingPin(
    time: number,
    onTrail: RollingPinTrailCallback,
  ) {
    if (
      this.rollingPinState ===
      "approach"
    ) {
      this.setVelocity(
        0,
        VERTICAL_SPEEDS["rolling-pin"] *
          this.speedMultiplier,
      );

      if (
        this.y <
        ROLLING_PIN_ATTACK_Y
      ) {
        return;
      }

      this.resetPhysicsPosition(
        this.x,
        ROLLING_PIN_ATTACK_Y,
      );

      this.startRollingPinTelegraph(
        time,
      );

      return;
    }

    if (
      this.rollingPinState ===
      "telegraph"
    ) {
      this.setVelocity(0, 0);

      if (
        time <
        this.rollingPinTelegraphEndsAt
      ) {
        return;
      }

      this.scene.tweens.killTweensOf(
        this,
      );

      this.clearTint();
      this.setAngle(0);
      this.setScale(
        ROLLING_PIN_SCALE,
      );

      this.rollingPinState =
        "dash";

      this.rollingPinDashEndsAt =
        time +
        ROLLING_PIN_DASH_TIMEOUT;

      this.setVelocity(
        this.rollingPinDirection *
          ROLLING_PIN_DASH_SPEED *
          this.speedMultiplier,
        0,
      );

      return;
    }

    const passedRight =
      this.rollingPinDirection > 0 &&
      this.x >
        this.scene.scale.width +
          ROLLING_PIN_OFFSCREEN_MARGIN;

    const passedLeft =
      this.rollingPinDirection < 0 &&
      this.x <
        -ROLLING_PIN_OFFSCREEN_MARGIN;

    const timedOut =
      time >=
      this.rollingPinDashEndsAt;

    if (
      !passedRight &&
      !passedLeft &&
      !timedOut
    ) {
      return;
    }

    this.finishRollingPinPass(
      time,
      onTrail,
    );
  }

  private finishRollingPinPass(
    time: number,
    onTrail: RollingPinTrailCallback,
  ) {
    const trailY = this.y;

    onTrail(trailY);

    this.rollingPinPasses += 1;

    this.setVelocity(0, 0);

    if (
      this.rollingPinPasses >=
      ROLLING_PIN_MAX_PASSES
    ) {
      this.destroy();
      return;
    }

    this.rollingPinDirection =
      this.rollingPinDirection > 0
        ? -1
        : 1;

    const nextX =
      this.rollingPinDirection > 0
        ? ROLLING_PIN_EDGE_X
        : this.scene.scale.width -
          ROLLING_PIN_EDGE_X;

    this.resetPhysicsPosition(
      nextX,
      ROLLING_PIN_SECOND_PASS_Y,
    );

    this.startRollingPinTelegraph(
      time,
    );
  }

  private startRollingPinTelegraph(
    time: number,
  ) {
    this.rollingPinState =
      "telegraph";

    this.rollingPinTelegraphEndsAt =
      time +
      ROLLING_PIN_TELEGRAPH_DURATION;

    this.setVelocity(0, 0);

    this.setTint(
      ROLLING_PIN_TELEGRAPH_TINT,
    );

    this.setAngle(-8);

    this.scene.tweens.add({
      targets: this,
      angle: 8,
      scaleX:
        ROLLING_PIN_SCALE * 1.1,
      scaleY:
        ROLLING_PIN_SCALE * 1.1,
      duration: 70,
      yoyo: true,
      repeat: 2,
    });
  }

  private resetPhysicsPosition(
    x: number,
    y: number,
  ) {
    const body =
      this.body as Phaser.Physics.Arcade.Body;

    body.reset(x, y);

    this.setPosition(x, y);
    this.setVelocity(0, 0);
  }

  private flashRollingPinHit() {
    if (
      this.rollingPinState ===
      "telegraph"
    ) {
      return;
    }

    this.setTint(
      ROLLING_PIN_HIT_TINT,
    );

    this.scene.time.delayedCall(
      80,
      () => {
        if (
          this.active &&
          this.rollingPinState !==
            "telegraph"
        ) {
          this.clearTint();
        }
      },
    );
  }

  private updateRavioli(
    time: number,
  ) {
    if (
      this.ravioliState ===
      "armored"
    ) {
      this.updateNormalMovement(
        time,
      );

      return;
    }

    if (
      this.ravioliState ===
      "broken"
    ) {
      this.ravioliState =
        "telegraph";

      this.ravioliChargeAt =
        time +
        RAVIOLI_TELEGRAPH_DURATION;

      this.setVelocity(0, 0);

      this.setTint(
        RAVIOLI_TELEGRAPH_TINT,
      );

      return;
    }

    if (
      this.ravioliState ===
      "telegraph"
    ) {
      this.setVelocity(0, 0);

      if (
        time <
        this.ravioliChargeAt
      ) {
        return;
      }

      this.clearTint();
      this.setRotation(0);

      this.setVelocity(
        0,
        RAVIOLI_CHARGE_SPEED *
          this.speedMultiplier,
      );

      this.ravioliState =
        "charge";

      return;
    }

    this.destroyRavioliOutsideScreen();
  }

  private breakRavioliArmor() {
    this.ravioliState = "broken";

    this.setTexture(
      RAVIOLI_CRACKED_TEXTURE,
    );

    this.setVelocity(0, 0);

    this.scene.tweens.add({
      targets: this,
      scaleX:
        RAVIOLI_SCALE * 1.12,
      scaleY:
        RAVIOLI_SCALE * 1.12,
      duration: 70,
      yoyo: true,
    });
  }

  private destroyRavioliOutsideScreen() {
    const margin =
      RAVIOLI_OUT_OF_BOUNDS_MARGIN;

    if (
      this.x < -margin ||
      this.x >
        this.scene.scale.width +
          margin ||
      this.y < -margin ||
      this.y >
        this.scene.scale.height +
          margin
    ) {
      this.destroy();
    }
  }

  private updateMeatball(
    time: number,
  ) {
    const angle =
      time *
        0.001 *
        MEATBALL_ORBIT_SPEED *
        this.speedMultiplier +
      this.zigzagPhase;

    const orbitVelocity =
      MEATBALL_ORBIT_RADIUS *
      MEATBALL_ORBIT_SPEED *
      this.speedMultiplier;

    const velocityX =
      Math.cos(angle) *
      orbitVelocity;

    const velocityY =
      MEATBALL_DOWN_SPEED *
        this.speedMultiplier +
      Math.sin(angle) *
        orbitVelocity;

    this.setVelocity(
      velocityX,
      velocityY,
    );

    this.setAngle(
      Math.sin(angle) * 14,
    );
  }

  private flashMeatballHit() {
    this.setTint(
      MEATBALL_HIT_TINT,
    );

    this.scene.time.delayedCall(
      70,
      () => {
        if (this.active) {
          this.clearTint();
        }
      },
    );
  }

  private updatePastaPot(
    time: number,
    onPour: PastaPotPourCallback,
  ) {
    if (
      this.pastaPotState ===
      "approach"
    ) {
      this.updatePastaPotMovement(
        VERTICAL_SPEEDS[
          "pasta-pot"
        ],
      );

      if (
        this.y <
        PASTA_POT_ROAM_Y
      ) {
        return;
      }

      this.setY(
        PASTA_POT_ROAM_Y,
      );

      this.pastaPotState =
        "roam";

      this.pastaPotPourAt =
        time +
        PASTA_POT_FIRST_POUR_DELAY;

      return;
    }

    if (
      this.pastaPotState ===
      "telegraph"
    ) {
      this.setVelocity(0, 0);

      if (
        time <
        this.pastaPotTelegraphEndsAt
      ) {
        return;
      }

      this.scene.tweens.killTweensOf(
        this,
      );

      this.setAngle(0);

      this.setScale(
        PASTA_POT_SCALE,
      );

      this.clearTint();

      onPour(
        this.x,
        this.y + 8,
      );

      this.pastaPotState =
        "roam";

      this.pastaPotPourAt =
        time +
        PASTA_POT_POUR_INTERVAL;

      return;
    }

    this.updatePastaPotMovement(
      0,
    );

    if (
      time <
      this.pastaPotPourAt
    ) {
      return;
    }

    this.pastaPotState =
      "telegraph";

    this.pastaPotTelegraphEndsAt =
      time +
      PASTA_POT_TELEGRAPH_DURATION;

    this.setVelocity(0, 0);

    this.setTint(
      PASTA_POT_TELEGRAPH_TINT,
    );

    this.setAngle(-5);

    this.scene.tweens.add({
      targets: this,
      angle: 5,
      scaleX:
        PASTA_POT_SCALE * 1.08,
      scaleY:
        PASTA_POT_SCALE * 1.08,
      duration: 80,
      yoyo: true,
      repeat: 2,
    });
  }

  private updatePastaPotMovement(
    verticalSpeed: number,
  ) {
    if (
      this.x <=
        PASTA_POT_MIN_X &&
      this.pastaPotDirection < 0
    ) {
      this.pastaPotDirection = 1;
    }

    if (
      this.x >=
        PASTA_POT_MAX_X &&
      this.pastaPotDirection > 0
    ) {
      this.pastaPotDirection = -1;
    }

    this.setVelocity(
      this.pastaPotDirection *
        PASTA_POT_HORIZONTAL_SPEED *
        this.speedMultiplier,
      verticalSpeed *
        this.speedMultiplier,
    );
  }

  private flashPastaPotHit() {
    if (
      this.pastaPotState ===
      "telegraph"
    ) {
      return;
    }

    this.setTint(
      PASTA_POT_HIT_TINT,
    );

    this.scene.time.delayedCall(
      80,
      () => {
        if (
          this.active &&
          this.pastaPotState !==
            "telegraph"
        ) {
          this.clearTint();
        }
      },
    );
  }

  private updatePepperGrinder(
    time: number,
    onShoot: PepperShootCallback,
  ) {
    if (
      this.pepperGrinderState ===
      "approach"
    ) {
      this.updatePepperGrinderMovement(
        VERTICAL_SPEEDS[
          "pepper-grinder"
        ],
      );

      if (
        this.y <
        PEPPER_GRINDER_ROAM_Y
      ) {
        return;
      }

      this.setY(
        PEPPER_GRINDER_ROAM_Y,
      );

      this.pepperGrinderState =
        "roam";

      this.pepperAttackAt =
        time +
        PEPPER_GRINDER_FIRST_ATTACK_DELAY;

      return;
    }

    if (
      this.pepperGrinderState ===
      "telegraph"
    ) {
      this.setVelocity(0, 0);

      if (
        time <
        this.pepperTelegraphEndsAt
      ) {
        return;
      }

      this.scene.tweens.killTweensOf(
        this,
      );

      this.setAngle(0);

      this.setScale(
        PEPPER_GRINDER_SCALE,
      );

      this.clearTint();

      this.firePepperSprinkle(
        onShoot,
      );

      this.pepperGrinderState =
        "roam";

      this.pepperAttackAt =
        time +
        PEPPER_GRINDER_ATTACK_INTERVAL;

      return;
    }

    this.updatePepperGrinderMovement(
      0,
    );

    if (
      time <
      this.pepperAttackAt
    ) {
      return;
    }

    this.pepperGrinderState =
      "telegraph";

    this.pepperTelegraphEndsAt =
      time +
      PEPPER_GRINDER_TELEGRAPH_DURATION;

    this.setVelocity(0, 0);

    this.setTint(
      PEPPER_GRINDER_TELEGRAPH_TINT,
    );

    this.setAngle(-8);

    this.scene.tweens.add({
      targets: this,
      angle: 8,
      scaleX:
        PEPPER_GRINDER_SCALE *
        1.12,
      scaleY:
        PEPPER_GRINDER_SCALE *
        1.12,
      duration: 55,
      yoyo: true,
      repeat: 2,
    });
  }

  private firePepperSprinkle(
    onShoot: PepperShootCallback,
  ) {
    for (
      let i = 0;
      i <
      PEPPER_PROJECTILE_COUNT;
      i += 1
    ) {
      this.scene.time.delayedCall(
        i *
          PEPPER_BURST_DELAY,
        () => {
          if (
            !this.active
          ) {
            return;
          }

          const spawnX =
            this.x +
            Phaser.Math.Between(
              -PEPPER_SPAWN_OFFSET_X,
              PEPPER_SPAWN_OFFSET_X,
            );

          const spawnY =
            this.y +
            Phaser.Math.Between(
              8,
              12,
            );

          const velocityX =
            Phaser.Math.Between(
              PEPPER_MIN_VELOCITY_X,
              PEPPER_MAX_VELOCITY_X,
            );

          const velocityY =
            Phaser.Math.Between(
              PEPPER_MIN_VELOCITY_Y,
              PEPPER_MAX_VELOCITY_Y,
            );

          onShoot(
            spawnX,
            spawnY,
            velocityX,
            velocityY,
          );
        },
      );
    }
  }

  private updatePepperGrinderMovement(
    verticalSpeed: number,
  ) {
    if (
      this.x <=
        PEPPER_GRINDER_MIN_X &&
      this.pepperDirection < 0
    ) {
      this.pepperDirection = 1;
    }

    if (
      this.x >=
        PEPPER_GRINDER_MAX_X &&
      this.pepperDirection > 0
    ) {
      this.pepperDirection = -1;
    }

    this.setVelocity(
      this.pepperDirection *
        PEPPER_GRINDER_HORIZONTAL_SPEED *
        this.speedMultiplier,
      verticalSpeed *
        this.speedMultiplier,
    );
  }

  private flashPepperGrinderHit() {
    if (
      this.pepperGrinderState ===
      "telegraph"
    ) {
      return;
    }

    this.setTint(
      PEPPER_GRINDER_HIT_TINT,
    );

    this.scene.time.delayedCall(
      80,
      () => {
        if (
          this.active &&
          this.pepperGrinderState !==
            "telegraph"
        ) {
          this.clearTint();
        }
      },
    );
  }

  private updateBasil(
    time: number,
  ) {
    let velocityX =
      Math.sin(
        time / 140 +
          this.zigzagPhase,
      ) *
      BASIL_HORIZONTAL_SPEED *
      this.speedMultiplier;

    if (
      this.x <=
        BASIL_MIN_X &&
      velocityX < 0
    ) {
      velocityX =
        Math.abs(velocityX);
    }

    if (
      this.x >=
        BASIL_MAX_X &&
      velocityX > 0
    ) {
      velocityX =
        -Math.abs(velocityX);
    }

    this.setVelocity(
      velocityX,
      VERTICAL_SPEEDS.basil *
        this.speedMultiplier,
    );

    this.setAngle(
      Phaser.Math.Clamp(
        velocityX * 0.08,
        -22,
        22,
      ),
    );
  }

  private updateFork(
    time: number,
    playerX: number,
    playerY: number,
  ) {
    if (
      this.forkState ===
      "approach"
    ) {
      this.updateNormalMovement(
        time,
      );

      if (
        this.y <
        FORK_DIVE_TRIGGER_Y
      ) {
        return;
      }

      this.targetX =
        playerX;

      this.targetY =
        playerY;

      this.forkState =
        "telegraph";

      this.forkDiveTime =
        time +
        FORK_TELEGRAPH_DURATION;

      this.setVelocity(
        0,
        0,
      );

      this.setTint(
        0xf2cf66,
      );

      return;
    }

    if (
      this.forkState !==
        "telegraph" ||
      time <
        this.forkDiveTime
    ) {
      return;
    }

    this.clearTint();

    const angle =
      Phaser.Math.Angle.Between(
        this.x,
        this.y,
        this.targetX,
        this.targetY,
      );

    this.setVelocity(
      Math.cos(angle) *
        FORK_DIVE_SPEED *
        this.speedMultiplier,
      Math.sin(angle) *
        FORK_DIVE_SPEED *
        this.speedMultiplier,
    );

    this.forkState =
      "dive";
  }

  private updateGrater(
    time: number,
    playerX: number,
    playerY: number,
    onShoot: GraterShootCallback,
  ) {
    if (
      this.graterState ===
      "approach"
    ) {
      this.updateGraterMovement(
        time,
        VERTICAL_SPEEDS.grater,
      );

      if (
        this.y <
        GRATER_ATTACK_TRIGGER_Y
      ) {
        return;
      }

      this.targetX =
        playerX;

      this.targetY =
        playerY;

      this.graterState =
        "telegraph";

      this.graterShootTime =
        time +
        GRATER_TELEGRAPH_DURATION;

      this.setVelocity(
        0,
        0,
      );

      this.setTint(
        0xe84a32,
      );

      return;
    }

    if (
      this.graterState ===
      "telegraph"
    ) {
      if (
        time <
        this.graterShootTime
      ) {
        return;
      }

      this.clearTint();

      if (
        this.isGraterDamaged
      ) {
        this.setTint(
          GRATER_DAMAGED_TINT,
        );
      }

      onShoot(
        this.x,
        this.y + 8,
        this.targetX,
        this.targetY,
      );

      this.graterState =
        "roam";

      this.scheduleGraterRetreat(
        time,
      );

      return;
    }

    if (
      this.graterState ===
      "retreat"
    ) {
      this.updateGraterRetreat(
        time,
      );

      return;
    }

    this.updateGraterMovement(
      time,
      GRATER_ROAM_SPEED,
    );

    if (
      this.graterRetreats <
        GRATER_MAX_RETREATS &&
      time >=
        this.graterRetreatAt
    ) {
      this.startGraterRetreat(
        time,
      );
    }
  }

  private updateGraterMovement(
    time: number,
    verticalSpeed: number,
  ) {
    const velocityX =
      this.getGraterHorizontalVelocity(
        time,
      );

    this.setVelocity(
      velocityX,
      verticalSpeed *
        this.speedMultiplier,
    );
  }

  private updateGraterRetreat(
    time: number,
  ) {
    const velocityX =
      this.getGraterHorizontalVelocity(
        time,
      );

    this.setVelocity(
      velocityX,
      -GRATER_RETREAT_SPEED *
        this.speedMultiplier,
    );

    if (
      time <
      this.graterRetreatEndsAt
    ) {
      return;
    }

    this.graterState =
      "roam";

    if (
      this.graterRetreats <
      GRATER_MAX_RETREATS
    ) {
      this.scheduleGraterRetreat(
        time,
      );
    }
  }

  private startGraterRetreat(
    time: number,
  ) {
    this.graterRetreats += 1;

    this.graterState =
      "retreat";

    this.graterRetreatEndsAt =
      time +
      GRATER_RETREAT_DURATION;
  }

  private scheduleGraterRetreat(
    time: number,
  ) {
    this.graterRetreatAt =
      time +
      Phaser.Math.Between(
        GRATER_RETREAT_MIN_DELAY,
        GRATER_RETREAT_MAX_DELAY,
      );
  }

  private getGraterHorizontalVelocity(
    time: number,
  ) {
    let velocityX =
      Math.sin(
        time / 320 +
          this.zigzagPhase,
      ) *
      GRATER_HORIZONTAL_SPEED *
      this.speedMultiplier;

    if (
      this.x <=
        GRATER_MIN_X &&
      velocityX < 0
    ) {
      velocityX =
        Math.abs(velocityX);
    }

    if (
      this.x >=
        GRATER_MAX_X &&
      velocityX > 0
    ) {
      velocityX =
        -Math.abs(velocityX);
    }

    return velocityX;
  }

  private updateColander(
    time: number,
    onShoot: ColanderShootCallback,
  ) {
    if (
      this.colanderState ===
      "approach"
    ) {
      this.setVelocity(
        this.getColanderHorizontalVelocity(
          time,
        ),
        VERTICAL_SPEEDS.colander *
          this.speedMultiplier,
      );

      if (
        this.y <
        COLANDER_ROAM_Y
      ) {
        return;
      }

      this.setY(
        COLANDER_ROAM_Y,
      );

      this.setVelocity(
        0,
        0,
      );

      this.colanderState =
        "roam";

      this.colanderShootAt =
        time +
        COLANDER_FIRST_SHOT_DELAY;

      return;
    }

    if (
      this.colanderState ===
      "telegraph"
    ) {
      this.setVelocity(
        0,
        0,
      );

      if (
        time <
        this.colanderTelegraphEndsAt
      ) {
        return;
      }

      this.clearTint();

      onShoot(
        this.x,
        this.y + 12,
      );

      this.colanderState =
        "roam";

      this.colanderShootAt =
        time +
        COLANDER_SHOT_INTERVAL;

      return;
    }

    this.setVelocity(
      this.getColanderHorizontalVelocity(
        time,
      ),
      0,
    );

    if (
      time <
      this.colanderShootAt
    ) {
      return;
    }

    this.colanderState =
      "telegraph";

    this.colanderTelegraphEndsAt =
      time +
      COLANDER_TELEGRAPH_DURATION;

    this.setVelocity(
      0,
      0,
    );

    this.setTint(
      COLANDER_TELEGRAPH_TINT,
    );
  }

  private getColanderHorizontalVelocity(
    time: number,
  ) {
    let velocityX =
      Math.sin(
        time / 420 +
          this.zigzagPhase,
      ) *
      COLANDER_HORIZONTAL_SPEED *
      this.speedMultiplier;

    if (
      this.x <=
        COLANDER_MIN_X &&
      velocityX < 0
    ) {
      velocityX =
        Math.abs(velocityX);
    }

    if (
      this.x >=
        COLANDER_MAX_X &&
      velocityX > 0
    ) {
      velocityX =
        -Math.abs(velocityX);
    }

    return velocityX;
  }

  private flashColanderHit() {
    if (
      this.colanderState ===
      "telegraph"
    ) {
      return;
    }

    this.setTint(
      0xe3dfd3,
    );

    this.scene.time.delayedCall(
      80,
      () => {
        if (
          this.active &&
          this.colanderState !==
            "telegraph"
        ) {
          this.clearTint();
        }
      },
    );
  }

  private applyGraterDamagedState() {
    this.isGraterDamaged =
      true;

    this.setAngle(8);

    if (
      this.graterState !==
      "telegraph"
    ) {
      this.setTint(
        GRATER_DAMAGED_TINT,
      );
    }

    if (
      this.graterDamageSmoke
    ) {
      return;
    }

    this.graterDamageSmoke =
      this.scene.add.graphics();

    this.graterDamageSmoke.fillStyle(
      GRATER_SMOKE_COLOR,
      0.9,
    );

    this.graterDamageSmoke.fillRect(
      0,
      0,
      3,
      3,
    );

    this.graterDamageSmoke.fillRect(
      4,
      -5,
      3,
      3,
    );

    this.graterDamageSmoke.fillRect(
      1,
      -9,
      2,
      2,
    );

    this.graterDamageSmoke.setDepth(
      this.depth + 1,
    );
  }

  private updateDamageVisual() {
    this.graterDamageSmoke?.setPosition(
      this.x + 5,
      this.y - 10,
    );
  }

  private startCriticalBlink() {
    if (
      this.isCriticalBlinking
    ) {
      return;
    }

    this.isCriticalBlinking =
      true;

    this.scene.tweens.add({
      targets: this,
      alpha: 0.25,
      duration: 120,
      yoyo: true,
      repeat: -1,
    });
  }
}