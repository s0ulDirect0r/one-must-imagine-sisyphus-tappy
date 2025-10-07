import { KeyState } from "./input";
import { updateObstacles } from "./obstacle";

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 15;
export const MAX_OBSTACLES = 12;

export type GameState = {
  x: number;
  y: number;
  bpm: number;
  elevation: number;
  score: number;
  streak: number;
  trees: Tree[];
};

export type Tree = {
  id: string;
  x: number;
  y: number;
};

export const initialGameState: GameState = {
  x: 100,
  y: 100,
  bpm: 0,
  elevation: 0,
  score: 0,
  streak: 0,
  trees: [],
};

export function updateGame(
  inputs: Map<string, KeyState>,
  gameState: GameState,
) {
  // TODO: split this up into different files
  // player file?
  // obstacle generation system?
  // score system?
  let newGameState = gameState;
  if (inputs.get("Space")?.pressed) {
    newGameState = movePlayer(gameState);
  }
  newGameState = updateObstacles(inputs, newGameState);
  return newGameState;
}
// An example of some logic that we will move to a component later.
function movePlayer(gameState: GameState) {
  // A player has pressed the up key and the player is moving!
  // If "beatWindow = open", move the player forward and increase elevation
  // if "beatWindow = closed" player does NOT move forward, log a miss
  let elevationChange;
  let streakChange;

  // TODO: Change if argument to gameState.expectMove
  if (true) {
    elevationChange = gameState.elevation + 100;
    streakChange = gameState.streak + 1;
  } else {
    elevationChange = gameState.elevation;
    streakChange = 0;
  }

  const newGameState = {
    ...gameState,
    elevation: elevationChange,
    streak: streakChange,
  };

  return newGameState;
}
