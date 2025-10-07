import * as stateMachine from "./stateMachine";
import * as renderer from "./renderer";
import { isAudioPlaying } from "./audio";

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
export async function gameLoop() {
  // logic




  const newState = await stateMachine.updateGame(gameState); // call all the things that change it
  console.log("NEW", newState)
  gameState = newState;

  // pass it off to the renderer
  renderer.render(gameState);
}
