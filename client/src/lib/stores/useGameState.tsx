import { create } from "zustand";

export type GamePhase = "ready" | "playing" | "paused" | "ended";

interface GameState {
  gamePhase: GamePhase;
  score: number;
  lives: number;
  level: number;
  
  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  restartGame: () => void;
  setScore: (score: number) => void;
  setLives: (lives: number) => void;
  setLevel: (level: number) => void;
  incrementLevel: () => void;
}

export const useGameState = create<GameState>((set) => ({
  gamePhase: "ready",
  score: 0,
  lives: 3,
  level: 1,
  
  startGame: () => set({ gamePhase: "playing" }),
  pauseGame: () => set({ gamePhase: "paused" }),
  resumeGame: () => set({ gamePhase: "playing" }),
  endGame: () => set({ gamePhase: "ended" }),
  restartGame: () => set({ 
    gamePhase: "ready", 
    score: 0, 
    lives: 3, 
    level: 1 
  }),
  setScore: (score: number) => set({ score }),
  setLives: (lives: number) => set({ lives }),
  setLevel: (level: number) => set({ level }),
  incrementLevel: () => set((state) => ({ level: state.level + 1 })),
}));
