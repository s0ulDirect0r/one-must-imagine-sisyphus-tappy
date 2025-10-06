type GameState = {
    x: number;
    y: number;
    bpm: number;
    elevation: number;
    score: number;
    streak: number;
  }

export const initialGameState: GameState = {
  x: 2,
  y: 5,
  bpm: 0,
  elevation: 0,
  score: 0,
  streak: 0
}

export function Coordinator() {
  // Communicate with State Machine
  

  // Communicate with Audio

  // Communicate with Renderer
}