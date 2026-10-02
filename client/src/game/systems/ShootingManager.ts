import Phaser from "phaser";

import { Player } from "../entities/player/Player";
import { Projectile } from "../entities/player/Projectile";
import { InputManager } from "../input/InputManager";

const RAPID_FIRE_COOLDOWN = 120;

const SPREAD_SHOT_HORIZONTAL_SPEED = 45;

const NORMAL_DAMAGE = 1;
const PARMESAN_DAMAGE = 2;

type ShotCallback = () => void;

export class ShootingManager {
  private scene: Phaser.Scene;

  private projectiles: Projectile[] = [];

  private projectileDamage =
    new Map<Projectile, number>();

  private lastShotTime = 0;

  private onShot: ShotCallback;

  constructor(
    scene: Phaser.Scene,
    onShot: ShotCallback,
  ) {
    this.scene = scene;
    this.onShot = onShot;
  }

  update(
    time: number,
    player: Player,
    inputManager: InputManager,
    isRapidFireActive: boolean,
    isSpreadShotActive = false,
    isParmesanActive = false,
  ) {
    this.handleShooting(
      time,
      player,
      inputManager,
      isRapidFireActive,
      isSpreadShotActive,
      isParmesanActive,
    );

    this.projectiles.forEach(
      (projectile) => {
        projectile.update();
      },
    );

    this.projectiles.forEach(
      (projectile) => {
        if (!projectile.active) {
          this.projectileDamage.delete(
            projectile,
          );
        }
      },
    );

    this.projectiles =
      this.projectiles.filter(
        (projectile) =>
          projectile.active,
      );
  }

  private handleShooting(
    time: number,
    player: Player,
    inputManager: InputManager,
    isRapidFireActive: boolean,
    isSpreadShotActive: boolean,
    isParmesanActive: boolean,
  ) {
    if (isRapidFireActive) {
      const canShoot =
        time -
          this.lastShotTime >=
        RAPID_FIRE_COOLDOWN;

      if (
        inputManager.isFireHeld() &&
        canShoot
      ) {
        this.shoot(
          player,
          isSpreadShotActive,
          isParmesanActive,
        );

        this.lastShotTime = time;
      }

      return;
    }

    if (
      inputManager.isFirePressed()
    ) {
      this.shoot(
        player,
        isSpreadShotActive,
        isParmesanActive,
      );

      this.lastShotTime = time;
    }
  }

  private shoot(
    player: Player,
    isSpreadShotActive: boolean,
    isParmesanActive: boolean,
  ) {
    const damage =
      isParmesanActive
        ? PARMESAN_DAMAGE
        : NORMAL_DAMAGE;

    if (isSpreadShotActive) {
      this.shootSpread(
        player,
        damage,
      );

      return;
    }

    this.shootSingle(
      player,
      damage,
    );
  }

  private shootSingle(
    player: Player,
    damage: number,
  ) {
    const projectile =
      this.createProjectile(
        player.x,
        player.y - 14,
        0,
        damage,
      );

    this.projectiles.push(
      projectile,
    );

    this.onShot();
  }

  private shootSpread(
    player: Player,
    damage: number,
  ) {
    const leftProjectile =
      this.createProjectile(
        player.x - 3,
        player.y - 14,
        -SPREAD_SHOT_HORIZONTAL_SPEED,
        damage,
      );

    const centerProjectile =
      this.createProjectile(
        player.x,
        player.y - 14,
        0,
        damage,
      );

    const rightProjectile =
      this.createProjectile(
        player.x + 3,
        player.y - 14,
        SPREAD_SHOT_HORIZONTAL_SPEED,
        damage,
      );

    this.projectiles.push(
      leftProjectile,
      centerProjectile,
      rightProjectile,
    );

    // One press = one shot in stats,
    // even if spread creates 3 projectiles.
    for (let i = 0; i < 3; i++) {
  this.onShot();
}
  }

  private createProjectile(
    x: number,
    y: number,
    velocityX: number,
    damage: number,
  ) {
    const projectile =
      new Projectile(
        this.scene,
        x,
        y,
      );

    projectile.setVelocityX(
      velocityX,
    );

    if (
      damage ===
      PARMESAN_DAMAGE
    ) {
      projectile.setScale(1.8);
    }

    this.projectileDamage.set(
      projectile,
      damage,
    );

    return projectile;
  }

  getProjectiles() {
    return this.projectiles;
  }

  getProjectileDamage(
    projectile: Projectile,
  ) {
    return (
      this.projectileDamage.get(
        projectile,
      ) ?? NORMAL_DAMAGE
    );
  }

  clear() {
    this.projectiles.forEach(
      (projectile) => {
        projectile.destroy();
      },
    );

    this.projectiles = [];

    this.projectileDamage.clear();

    this.lastShotTime = 0;
  }
}