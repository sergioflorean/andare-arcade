import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { createGameConfig } from "../game/config";

export const GameCanvas = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameContainerRef.current) {
      return;
    }

    const game = new Phaser.Game(
      createGameConfig(gameContainerRef.current),
    );

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="game-frame">
      <div
        ref={gameContainerRef}
        className="game-container"
      />
    </div>
  );
};