import { useEffect, useRef } from "react";
import GameCanvas from "./GameCanvas";
import GameUI from "./GameUI";
import TouchControls from "./TouchControls";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";

export default function Game() {
  const { gamePhase, startGame } = useGameState();
  const { backgroundMusic, isMuted } = useAudio();
  const musicStarted = useRef(false);

  useEffect(() => {
    // Start background music when game starts
    if (gamePhase === "playing" && backgroundMusic && !isMuted && !musicStarted.current) {
      backgroundMusic.play().catch(console.log);
      musicStarted.current = true;
    }
  }, [gamePhase, backgroundMusic, isMuted]);

  const handleStart = () => {
    startGame();
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-black via-purple-900/20 to-black">
      <GameCanvas />
      <GameUI onStart={handleStart} />
      {gamePhase === "playing" && <TouchControls />}
    </div>
  );
}
