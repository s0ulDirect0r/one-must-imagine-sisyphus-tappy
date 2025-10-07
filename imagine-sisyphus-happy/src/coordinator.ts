import * as stateMachine from "./stateMachine";
import * as renderer from "./renderer";
import * as inputs from "./input";
import type { GameState } from "./stateMachine";
import { loadAudio, playAudio } from "./audio";
import { setUpMetronome } from "./metronome";

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
  if (gameState.needsAudio) {

    playAudio();


  }

  gameState = newState;

  // Render
  renderer.render(gameState);

  //TODO: audio system (adding fields to GameState, stop/play music)
  // audioSystem.handleAudio(gameState)
}
