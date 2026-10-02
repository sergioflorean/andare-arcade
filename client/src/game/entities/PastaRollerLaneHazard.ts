import Phaser from "phaser";

import {
  PASTA_ROLLER_TEXTURE,
} from "./createPastaRollerTexture";

const TELEGRAPH_DURATION = 1100;

const ROLLER_SPEED = 245;

const WARNING_WIDTH = 24;
const WARNING_ALPHA = 0.18;

const OFFSCREEN_MARGIN = 30;

type RollerLaneState =
  | "telegraph"
  | "rolling";

export class PastaRollerLaneHazard
  extends Phaser.Physics.Arcade.Sprite {
  private laneState: RollerLaneState =
    "telegraph";

  private warning?: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    x: number,
  ) {
    super(
      scene,
      x,
      -20,
      PASTA_ROLLER_TEXTURE,
    );

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(4);
    this.setVisible(false);

    const body =
      this.body as Phaser.Physics.Arcade.Body;

    body.enable = false;
    body.setAllowGravity(false);

    this.createWarning();

    scene.time.delayedCall(
      TELEGRAPH_DURATION,
      () => {
        if (!this.active) return;

        this.startRolling();
      },
    );

    this.once("destroy", () => {
      this.warning?.destroy();
      this.warning = undefined;
    });
  }

  update() {
    if (
      this.laneState !==
      "rolling"
    ) {
      return;
    }

    if (
      this.y >
      this.scene.scale.height +
        OFFSCREEN_MARGIN
    ) {
      this.destroy();
    }
  }

  private createWarning() {
    this.warning =
      this.scene.add.rectangle(
        this.x,
        this.scene.scale.height / 2,
        WARNING_WIDTH,
        this.scene.scale.height,
        0xff3b30,
        WARNING_ALPHA,
      );

    this.warning.setDepth(2);

    this.scene.tweens.add({
      targets: this.warning,
      alpha: 0.42,
      duration: 90,
      yoyo: true,
      repeat: 4,
    });
  }

  private startRolling() {
    this.warning?.destroy();
    this.warning = undefined;

    this.laneState = "rolling";

    this.setVisible(true);

    const body =
      this.body as Phaser.Physics.Arcade.Body;

    body.enable = true;
    body.reset(
      this.x,
      -20,
    );

    this.setVelocity(
      0,
      ROLLER_SPEED,
    );
  }
}