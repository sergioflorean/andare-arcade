import Phaser from "phaser";
import { Player } from "../entities/Player";
import { InputManager } from "../input/InputManager";
import { createClassicBoxTexture } from "../entities/createClassicBoxTexture";

export class ArcadeScene extends Phaser.Scene {
  private player!: Player;

  constructor() {
    super("ArcadeScene");
  }

  create() {
    this.add.text(8, 8, "1UP", {
      fontFamily: "monospace",
      fontSize: "8px",
      color: "#f5e7c6",
    });

    this.add.text(82, 8, "HIGH SCORE", {
      fontFamily: "monospace",
      fontSize: "8px",
      color: "#f5e7c6",
    });

    this.add.text(8, 18, "000000", {
      fontFamily: "monospace",
      fontSize: "8px",
      color: "#e84a32",
    });

    this.add.text(112, 18, "010000", {
      fontFamily: "monospace",
      fontSize: "8px",
      color: "#e84a32",
    });

    this.add
      .text(112, 105, "ANDARE", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#f1c84c",
      })
      .setOrigin(0.5);

    this.add
      .text(112, 126, "PASTA RUSH", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#e84a32",
      })
      .setOrigin(0.5);

    this.add
      .text(112, 151, "FRESH PASTA TO GO", {
        fontFamily: "monospace",
        fontSize: "7px",
        color: "#f5e7c6",
      })
      .setOrigin(0.5);

    const pressStart = this.add
      .text(112, 205, "PRESS START", {
        fontFamily: "monospace",
        fontSize: "9px",
        color: "#f5e7c6",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: pressStart,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
      hold: 250,
    });

    this.add
      .text(112, 270, "© ANDARE", {
        fontFamily: "monospace",
        fontSize: "6px",
        color: "#9d8a6d",
      })
      .setOrigin(0.5);

    createClassicBoxTexture(this);

    const inputManager = new InputManager(this);

    this.player = new Player(
      this,
      112,
      245,
      inputManager,
    );
  }

  update() {
    this.player.update();
  }
}