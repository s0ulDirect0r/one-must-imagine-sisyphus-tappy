import { KeyState } from "./input";
import { updateObstacles } from "./obstacle";

export const GRID_WIDTH = 10
export const GRID_HEIGHT = 15
export const MAX_OBSTACLES = 12

export type GameState = {
  x: number;
  y: number;
  bpm: number;
  elevation: number;
  score: number;
  streak: number;
  trees: Tree[]
};

export type Tree = {
  id: string,
  x: number,
  y: number
}

export const initialGameState: GameState = {
  x: 100,
  y: 100,
  bpm: 0,
  elevation: 0,
  score: 0,
  streak: 0,
  trees: []
};

export function updateGame(inputs: Map<string, KeyState>, gameState: GameState) {
  // TODO: split this up into different files
  // player file? 
  // obstacle generation system?
  // score system?
  let newGameState = movePlayer(gameState);
  newGameState = updateObstacles(inputs, gameState)
  return newGameState;
}
// An example of some logic that we will move to a component later.
function movePlayer(gameState: GameState) {
  const newGameState = {
    ...gameState,
    x: gameState.x + 1,
  };
  return newGameState;
}

