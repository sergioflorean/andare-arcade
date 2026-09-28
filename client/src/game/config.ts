import Phaser from "phaser";
import { ArcadeScene } from "./scenes/ArcadeScene";
import { GameScene } from "./scenes/GameScene";

export const GAME_WIDTH = 224;
export const GAME_HEIGHT = 288;

export const createGameConfig = (
  parent: HTMLElement,
): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,

  width: GAME_WIDTH,
  height: GAME_HEIGHT,

  parent,

  backgroundColor: "#17120d",

  pixelArt: true,

  render: {
    antialias: false,
    roundPixels: true,
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        x: 0,
        y: 0,
      },
      debug: false,
    },
  },

  scene: [ArcadeScene, GameScene],
});