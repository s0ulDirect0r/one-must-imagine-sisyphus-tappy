import * as stateMachine from "./stateMachine";
import * as renderer from "./renderer";

let gameState: GameState;

export function initializeGameState(): GameState {
  gameState = stateMachine.initialGameState;


  // passing it off to the renderer
  renderer.initialize(gameState);
}

export function startGameLoop() {
  // start the game loop forever.
  setInterval(() => {
    gameLoop();
  }, 16);
}

// This will run 60x per second.
export function gameLoop() {
  // logic
  const newState = stateMachine.updateGame(gameState); // call all the things that change it

  gameState = newState;

  // pass it off to the renderer
  renderer.render(gameState);
}
