import Phaser from "phaser";

import { Player } from "../entities/player/Player";
import { PowerUp } from "../entities/powerups/PowerUp";

import { createSalsaRossaTexture } from "../entities/powerups/createSalsaRossaTexture";
import { createPestoTexture } from "../entities/powerups/createPestoTexture";
import { createParmesanTexture } from "../entities/powerups/createParmesanTexture";
import { createGarlicTexture } from "../entities/powerups/createGarlicTexture";

import type { PowerUpType } from "../types";

const POWER_UP_DROP_CHANCE = 0.25;

const RAPID_FIRE_DURATION = 5000;
const SPREAD_SHOT_DURATION = 5000;
const PARMESAN_DURATION = 10000;
const GARLIC_SHIELD_HITS = 3;

const POWER_UP_TYPES: PowerUpType[] = [
  "salsa-rossa",
  "pesto",
  "parmesan",
  "garlic",
];

export class PowerUpManager {
  private scene: Phaser.Scene;
  private player?: Player;

  private powerUps: PowerUp[] = [];

  private rapidFireUntil = 0;
  private spreadShotUntil = 0;
  private parmesanUntil = 0;

  
  private shieldHitsRemaining = 0;
  private shieldRing?: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    createSalsaRossaTexture(scene);
    createPestoTexture(scene);
    createParmesanTexture(scene);
    createGarlicTexture(scene);
  }

  setPlayer(player: Player) {
    this.player = player;
  }

  trySpawn(x: number, y: number) {
    if (Math.random() >= POWER_UP_DROP_CHANCE) return;

    const powerUp = new PowerUp(
      this.scene,
      x,
      y,
      this.getRandomPowerUpType(),
    );

    this.powerUps.push(powerUp);
  }

  update() {
    this.powerUps.forEach((powerUp) => powerUp.update());

    this.powerUps = this.powerUps.filter(
      (powerUp) => powerUp.active,
    );

    if (this.shieldRing && this.player) {
      this.shieldRing.setPosition(
        this.player.x,
        this.player.y,
      );
    }
  }

  activatePowerUp(powerUpType: PowerUpType) {
    const now = this.scene.time.now;

    switch (powerUpType) {
      case "salsa-rossa":
        this.rapidFireUntil = now + RAPID_FIRE_DURATION;
        break;

      case "pesto":
        this.spreadShotUntil = now + SPREAD_SHOT_DURATION;
        break;

      case "parmesan":
        this.parmesanUntil = now + PARMESAN_DURATION;
        break;

      case "garlic":
        this.shieldHitsRemaining = GARLIC_SHIELD_HITS;
        this.showShield();
        break;
    }
  }

  isRapidFireActive() {
    return this.scene.time.now < this.rapidFireUntil;
  }

  isSpreadShotActive() {
    return this.scene.time.now < this.spreadShotUntil;
  }

  isParmesanActive() {
    return this.scene.time.now < this.parmesanUntil;
  }

  isShieldActive() {
  return this.shieldHitsRemaining > 0;
}

consumeShield() {
  if (this.shieldHitsRemaining <= 0) return false;

  this.shieldHitsRemaining -= 1;

  if (this.shieldHitsRemaining === 0) {
    this.breakShield();
  } else {
    this.updateShieldVisual();
  }

  return true;
}

  getActivePowerUps() {
    return this.powerUps;
  }

  removePowerUp(powerUp: PowerUp) {
    powerUp.destroy();

    this.powerUps = this.powerUps.filter(
      (item) => item !== powerUp,
    );
  }

  clear() {
    this.powerUps.forEach((powerUp) => powerUp.destroy());

    this.powerUps = [];

    this.rapidFireUntil = 0;
    this.spreadShotUntil = 0;
    this.parmesanUntil = 0;

    this.shieldHitsRemaining = 0;

    this.clearShieldVisual();
  }

  private getRandomPowerUpType(): PowerUpType {
    const index = Math.floor(
      Math.random() * POWER_UP_TYPES.length,
    );

    return POWER_UP_TYPES[index] ?? "salsa-rossa";
  }

  private showShield() {
    if (!this.player) return;

    this.clearShieldVisual();

    this.shieldRing = this.scene.add.circle(
      this.player.x,
      this.player.y,
      17,
      0x000000,
      0,
    );

    this.shieldRing.setStrokeStyle(
      2,
      0xf5e7c6,
      0.9,
    );

    this.shieldRing.setDepth(
      this.player.depth + 1,
    );
  }

  private breakShield() {
    if (!this.shieldRing) return;

    const { x, y } = this.shieldRing;

    this.clearShieldVisual();

    const flash = this.scene.add.circle(
      x,
      y,
      17,
      0x000000,
      0,
    );

    flash.setStrokeStyle(
      2,
      0xf5e7c6,
      1,
    );

    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 1.6,
      duration: 180,
      onComplete: () => flash.destroy(),
    });
  }

  private updateShieldVisual() {
  if (!this.shieldRing) return;

  const alpha =
    this.shieldHitsRemaining / GARLIC_SHIELD_HITS;

  this.shieldRing.setStrokeStyle(
    2,
    0xf5e7c6,
    alpha,
  );
}

  private clearShieldVisual() {
    this.shieldRing?.destroy();
    this.shieldRing = undefined;
  }
}