import * as stateMachine from "./stateMachine";
import * as renderer from "./renderer";
import * as inputs from "./input";
import type { GameState } from "./stateMachine";
import { loadAudio, playAudio } from "./audio";
import { setUpMetronome } from "./metronome";

let gameState = stateMachine.gameState;
let { bpm, songDuration } = await loadAudio();

export function initializeGameState(): void {
  inputs.initialize();
  // passing it off to the renderer
  renderer.initialize(gameState);
}

export function startGameLoop() {
  // start the game loop forever.
  loopInterval = setInterval(() => {
    gameLoop();
  }, 16);
}

export function endGameLoop() {
  clearInterval(loopInterval);
}

// This will run 60x per second.
export function gameLoop() {
  // logic
  const newState = stateMachine.updateGame(inputs.inputState, gameState); // call all the things that change it
  if (gameState.needsAudio) {
    setUpMetronome(bpm);
    playAudio();
    newState.needsAudio = false;
  } else {
    newState.songBpm = bpm;
    newState.songDuration = songDuration;
    newState.timePassedSinceSongStarted = 0;
    newState.needsAudio = false;
  }

  gameState = { ...gameState, ...newState };

  inputs.updateInputs();

  // Render
  if (gameState.lost) {
    console.log("GAME OVER!");
    endGameLoop();
  }
  renderer.render(gameState);

  //TODO: audio system (adding fields to GameState, stop/play music)
  // audioSystem.handleAudio(gameState)
}
