import { useEffect } from "react";
import Game from "./components/Game";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";
import "./index.css";

function App() {
  const { setBackgroundMusic, setHitSound, setSuccessSound, setShootSound, setGameOverSound } = useAudio();

  useEffect(() => {
    // Initialize audio elements
    const backgroundMusic = new Audio("/sounds/background.mp3");
    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");
    const shootSound = new Audio("/sounds/hit.mp3"); // Use hit sound for shooting with different settings
    const gameOverSound = new Audio("/sounds/success.mp3"); // Use success sound for game over with different settings

    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;

    setBackgroundMusic(backgroundMusic);
    setHitSound(hitSound);
    setSuccessSound(successSound);
    setShootSound(shootSound);
    setGameOverSound(gameOverSound);
  }, [setBackgroundMusic, setHitSound, setSuccessSound, setShootSound, setGameOverSound]);

  return (
    <div className="w-full h-full bg-black overflow-hidden">
      <Game />
    </div>
  );
}

export default App;
