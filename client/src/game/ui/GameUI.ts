import Phaser from "phaser";

interface StageResults {
  title: string;
  score: number;
  enemiesDefeated: number;
  shotsFired: number;
  hits: number;
  accuracy: number;
}

type CompleteCallback = () => void;

export class GameUI {
  private scene: Phaser.Scene;

  private hudContainer?: Phaser.GameObjects.Container;

  private scoreText!: Phaser.GameObjects.Text;
  private waveText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;

  private comboText!: Phaser.GameObjects.Text;
  private multiplierText!: Phaser.GameObjects.Text;

  private currentMultiplier = 1;

  private resultsContainer?: Phaser.GameObjects.Container;
  private resultsStartText?: Phaser.GameObjects.Text;

  private gameCompleteContainer?: Phaser.GameObjects.Container;
  private gameCompleteStartText?: Phaser.GameObjects.Text;

  private transientText?: Phaser.GameObjects.Text;
  private transientTimer?: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  createHud(
    score: number,
    lives: number,
  ) {
    this.hudContainer =
      this.scene.add.container(
        0,
        0,
      );

    const oneUpText =
      this.scene.add.text(
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
      this.scene.add.text(
        8,
        18,
        score
          .toString()
          .padStart(6, "0"),
        {
          fontFamily: "monospace",
          fontSize: "8px",
          color: "#e84a32",
        },
      );

    this.waveText =
      this.scene.add
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
      this.scene.add.text(
        170,
        18,
        `LIVES ${lives}`,
        {
          fontFamily: "monospace",
          fontSize: "8px",
          color: "#f5e7c6",
        },
      );

    this.comboText =
      this.scene.add
        .text(
          112,
          20,
          "COMBO 00",
          {
            fontFamily: "monospace",
            fontSize: "7px",
            color: "#f5e7c6",
          },
        )
        .setOrigin(0.5);

    this.multiplierText =
      this.scene.add
        .text(
          112,
          30,
          "x1",
          {
            fontFamily: "monospace",
            fontSize: "10px",
            color: "#e84a32",
          },
        )
        .setOrigin(0.5);

    this.hudContainer.add([
      oneUpText,
      this.scoreText,
      this.waveText,
      this.livesText,
      this.comboText,
      this.multiplierText,
    ]);
  }

  updateScore(score: number) {
    this.scoreText.setText(
      score
        .toString()
        .padStart(6, "0"),
    );
  }

  updateLives(lives: number) {
    this.livesText.setText(
      `LIVES ${lives}`,
    );
  }

  updateWave(
    waveNumber: number,
  ) {
    this.waveText.setText(
      `WAVE ${waveNumber
        .toString()
        .padStart(2, "0")}`,
    );
  }

  updateCombo(
    combo: number,
    multiplier: number,
  ) {
    this.comboText.setText(
      `COMBO ${combo
        .toString()
        .padStart(2, "0")}`,
    );

    this.multiplierText.setText(
      `x${multiplier}`,
    );

    if (
      multiplier >
      this.currentMultiplier
    ) {
      this.scene.tweens.add({
        targets:
          this.multiplierText,
        scale: 1.6,
        duration: 100,
        yoyo: true,
      });
    }

    this.currentMultiplier =
      multiplier;
  }

  setWaveLabel(label: string) {
    this.waveText.setText(label);
  }

  showHud() {
    this.hudContainer?.setVisible(
      true,
    );
  }

  hideHud() {
    this.hudContainer?.setVisible(
      false,
    );
  }

  showStageIntro(
    stage: number,
    onComplete: CompleteCallback,
  ) {
    this.clearTransient();

    const stageLabel =
      `STAGE ${stage
        .toString()
        .padStart(2, "0")}`;

    this.setWaveLabel(
      stageLabel,
    );

    const stageText =
      this.scene.add
        .text(
          112,
          130,
          stageLabel,
          {
            fontFamily: "monospace",
            fontSize: "16px",
            color: "#f5e7c6",
          },
        )
        .setOrigin(0.5);

    this.transientText =
      stageText;

    this.transientTimer =
      this.scene.time.delayedCall(
        1000,
        () => {
          this.transientTimer =
            undefined;

          stageText.destroy();

          if (
            this.transientText ===
            stageText
          ) {
            this.transientText =
              undefined;
          }

          onComplete();
        },
      );
  }

  showBossWarning(onComplete: CompleteCallback) {
  this.clearTransient();
  this.setWaveLabel("WARNING");

  const warningText = this.scene.add
    .text(112, 130, "WARNING", {
      fontFamily: "monospace",
      fontSize: "18px",
      color: "#e84a32",
    })
    .setOrigin(0.5);

  this.transientText = warningText;

  this.scene.tweens.add({
    targets: warningText,
    alpha: 0,
    duration: 300,
    yoyo: true,
    repeat: 4,

    onComplete: () => {
      warningText.destroy();

      if (this.transientText === warningText) {
        this.transientText = undefined;
      }

      this.scene.time.delayedCall(500, onComplete);
    },
  });
}

  showGameOver(
    onComplete: CompleteCallback,
  ) {
    this.clearTransient();

    this.setWaveLabel(
      "GAME OVER",
    );

    const gameOverText =
      this.scene.add
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

    this.transientText =
      gameOverText;

    this.transientTimer =
      this.scene.time.delayedCall(
        1200,
        () => {
          this.transientTimer =
            undefined;

          gameOverText.destroy();

          if (
            this.transientText ===
            gameOverText
          ) {
            this.transientText =
              undefined;
          }

          onComplete();
        },
      );
  }

  showStageClear(
    stage: number,
    onComplete: CompleteCallback,
  ) {
    this.clearTransient();

    this.setWaveLabel(
      "STAGE CLEAR",
    );

    const stageClearText =
      this.scene.add
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

    this.transientText =
      stageClearText;

    this.transientTimer =
      this.scene.time.delayedCall(
        1200,
        () => {
          this.transientTimer =
            undefined;

          stageClearText.destroy();

          if (
            this.transientText ===
            stageClearText
          ) {
            this.transientText =
              undefined;
          }

          onComplete();
        },
      );

    void stage;
  }

  showResults(
    results: StageResults,
  ) {
    this.clearTransient();
    this.hideResults();
    this.hideHud();

    this.resultsContainer =
      this.scene.add.container(
        0,
        0,
      );

    const background =
      this.scene.add.graphics();

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

    const titleText =
      this.scene.add
        .text(
          112,
          57,
          results.title,
          {
            fontFamily: "monospace",
            fontSize: "12px",
            color: "#f5e7c6",
          },
        )
        .setOrigin(0.5);

    const scoreText =
      this.scene.add.text(
        35,
        88,
        `SCORE      ${results.score
          .toString()
          .padStart(6, "0")}`,
        {
          fontFamily: "monospace",
          fontSize: "8px",
          color: "#f5e7c6",
        },
      );

    const enemiesText =
      this.scene.add.text(
        35,
        108,
        `ENEMIES    ${results.enemiesDefeated
          .toString()
          .padStart(2, "0")}`,
        {
          fontFamily: "monospace",
          fontSize: "8px",
          color: "#f5e7c6",
        },
      );

    const shotsText =
      this.scene.add.text(
        35,
        128,
        `SHOTS      ${results.shotsFired
          .toString()
          .padStart(3, "0")}`,
        {
          fontFamily: "monospace",
          fontSize: "8px",
          color: "#f5e7c6",
        },
      );

    const hitsText =
      this.scene.add.text(
        35,
        148,
        `HITS       ${results.hits
          .toString()
          .padStart(3, "0")}`,
        {
          fontFamily: "monospace",
          fontSize: "8px",
          color: "#f5e7c6",
        },
      );

    const accuracyText =
      this.scene.add.text(
        35,
        168,
        `ACCURACY   ${results.accuracy
          .toString()
          .padStart(3, " ")}%`,
        {
          fontFamily: "monospace",
          fontSize: "8px",
          color: "#e84a32",
        },
      );

    this.resultsStartText =
      this.scene.add
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

    this.resultsContainer.add([
      background,
      titleText,
      scoreText,
      enemiesText,
      shotsText,
      hitsText,
      accuracyText,
      this.resultsStartText,
    ]);

    this.scene.tweens.add({
      targets:
        this.resultsStartText,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }

  hideResults() {
    if (this.resultsStartText) {
      this.scene.tweens.killTweensOf(
        this.resultsStartText,
      );
    }

    this.resultsContainer?.destroy(
      true,
    );

    this.resultsContainer =
      undefined;

    this.resultsStartText =
      undefined;
  }

  showGameComplete(
    finalScore: number,
  ) {
    this.clearTransient();
    this.hideResults();
    this.hideHud();

    this.setWaveLabel(
      "COMPLETE",
    );

    this.gameCompleteContainer =
      this.scene.add.container(
        0,
        0,
      );

    const background =
      this.scene.add.graphics();

    background.fillStyle(
      0x17120d,
      0.98,
    );

    background.fillRect(
      12,
      52,
      200,
      184,
    );

    background.lineStyle(
      2,
      0xe84a32,
      1,
    );

    background.strokeRect(
      12,
      52,
      200,
      184,
    );

    const completeText =
      this.scene.add
        .text(
          112,
          82,
          "GAME COMPLETE",
          {
            fontFamily: "monospace",
            fontSize: "14px",
            color: "#f5e7c6",
          },
        )
        .setOrigin(0.5);

    const scoreLabel =
      this.scene.add
        .text(
          112,
          125,
          "FINAL SCORE",
          {
            fontFamily: "monospace",
            fontSize: "8px",
            color: "#e84a32",
          },
        )
        .setOrigin(0.5);

    const scoreText =
      this.scene.add
        .text(
          112,
          145,
          finalScore
            .toString()
            .padStart(6, "0"),
          {
            fontFamily: "monospace",
            fontSize: "16px",
            color: "#f5e7c6",
          },
        )
        .setOrigin(0.5);

    this.gameCompleteStartText =
      this.scene.add
        .text(
          112,
          205,
          "PRESS START",
          {
            fontFamily: "monospace",
            fontSize: "8px",
            color: "#f5e7c6",
          },
        )
        .setOrigin(0.5);

    this.gameCompleteContainer.add([
      background,
      completeText,
      scoreLabel,
      scoreText,
      this.gameCompleteStartText,
    ]);

    this.scene.tweens.add({
      targets:
        this.gameCompleteStartText,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }

  private clearTransient() {
    if (this.transientTimer) {
      this.transientTimer.remove(
        false,
      );

      this.transientTimer =
        undefined;
    }

    if (this.transientText) {
      this.scene.tweens.killTweensOf(
        this.transientText,
      );

      this.transientText.destroy();

      this.transientText =
        undefined;
    }
  }
}