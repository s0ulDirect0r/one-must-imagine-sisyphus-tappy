export type GameState = {
  x: number;
  y: number;
  bpm: number;
  elevation: number;
  score: number;
  streak: number;
};

export const initialGameState: GameState = {
  x: 100,
  y: 100,
  bpm: 0,
  elevation: 0,
  score: 0,
  streak: 0,
};

export function updateGame(gameState: GameState) {
  const newGameState = movePlayer(gameState);
  // We will mutate newGameState however necessary to match
  // the current inputs and outputs and obstacles and etc.
  // These will be from various different components
  // and from StateMachine

  // Communicate with State Machine
  // Communicate with Audio
  // Communicate with Renderer

  return newGameState;
}

// An example of some logic that we will move to a component later.
function movePlayer(gameState: GameState) {
  console.log("changing...", gameState);
  const newGameState = {
    ...gameState,
    x: gameState.x + 1,
  };
  console.log("newGameState:", newGameState);
  return newGameState;
}
