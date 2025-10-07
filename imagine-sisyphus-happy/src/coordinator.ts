import * as stateMachine from "./stateMachine";
import * as renderer from "./renderer";
import * as inputs from "./input";
import type { GameState } from "./stateMachine";

let gameState: GameState;

export function initializeGameState(): void {
  gameState = stateMachine.initialGameState;
  inputs.initialize();
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
  const newInputs = inputs.updateInputs();
  // logic
  const newState = stateMachine.updateGame(newInputs, gameState); // call all the things that change it

  gameState = newState;

  // pass it off to the renderer
  renderer.render(gameState);

  //TODO: audio system (adding fields to GameState, stop/play music)
  // audioSystem.handleAudio(gameState)
}
