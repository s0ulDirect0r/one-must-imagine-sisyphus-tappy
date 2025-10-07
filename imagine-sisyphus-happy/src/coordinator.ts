import * as stateMachine from "./stateMachine";
import * as renderer from "./renderer";
import { loadAudio, playAudio } from "./audio";
import { setUpMetronome } from "./metronome";

let gameState: GameState;

export async function initializeGameState(): GameState {
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
  //play song

  if (gameState.needsAudio) {

    playAudio();

  }



  // Update logic
  const newState = stateMachine.updateGame(gameState);
  gameState = newState;

  // Render
  renderer.render(gameState);
}
