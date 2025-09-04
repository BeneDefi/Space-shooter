import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Volume2, VolumeX, Play, RotateCcw, Pause } from "lucide-react";

interface GameUIProps {
  onStart: () => void;
}

export default function GameUI({ onStart }: GameUIProps) {
  const { gamePhase, score, lives, restartGame, pauseGame, resumeGame } = useGameState();
  const { toggleMute, isMuted } = useAudio();

  if (gamePhase === "ready") {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Card className="w-full max-w-sm mx-4 bg-black/80 border-purple-500">
          <CardContent className="p-6 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Galaxiga</h1>
            <p className="text-purple-300 mb-6">Classic Space Shooter</p>
            
            <div className="space-y-4">
              <Button 
                onClick={onStart}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Game
              </Button>
              
              <Button 
                variant="outline"
                onClick={toggleMute}
                className="w-full border-purple-500 text-purple-300"
              >
                {isMuted ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
                {isMuted ? "Unmute" : "Mute"} Sound
              </Button>
            </div>
            
            <div className="mt-6 text-xs text-purple-400">
              <p>Desktop: Use Arrow Keys or WASD</p>
              <p>Mobile: Touch to move</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gamePhase === "paused") {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Card className="w-full max-w-sm mx-4 bg-black/80 border-yellow-500">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Game Paused</h2>
            <p className="text-yellow-300 mb-4">Score: {score}</p>
            
            <div className="space-y-4">
              <Button 
                onClick={resumeGame}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Play className="mr-2 h-4 w-4" />
                Resume
              </Button>
              
              <Button 
                onClick={restartGame}
                variant="outline"
                className="w-full border-yellow-500 text-yellow-300"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Restart
              </Button>
              
              <Button 
                variant="outline"
                onClick={toggleMute}
                className="w-full border-yellow-500 text-yellow-300"
              >
                {isMuted ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
                {isMuted ? "Unmute" : "Mute"} Sound
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gamePhase === "ended") {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Card className="w-full max-w-sm mx-4 bg-black/80 border-red-500">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Game Over</h2>
            <p className="text-red-300 mb-4">Final Score: {score}</p>
            
            <div className="space-y-4">
              <Button 
                onClick={restartGame}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Play Again
              </Button>
              
              <Button 
                variant="outline"
                onClick={toggleMute}
                className="w-full border-red-500 text-red-300"
              >
                {isMuted ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
                {isMuted ? "Unmute" : "Mute"} Sound
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Playing UI
  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
      <div className="bg-black/60 rounded-lg p-3 text-white">
        <div className="text-sm">Score: {score}</div>
        <div className="text-sm">Lives: {lives}</div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline"
          size="sm"
          onClick={pauseGame}
          className="bg-black/60 border-yellow-500 text-yellow-300"
        >
          <Pause className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline"
          size="sm"
          onClick={toggleMute}
          className="bg-black/60 border-purple-500 text-purple-300"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
