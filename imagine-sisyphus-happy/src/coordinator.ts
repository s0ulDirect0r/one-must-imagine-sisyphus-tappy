import * as stateMachine from "./stateMachine";
import * as renderer from "./renderer";
import * as inputs from "./input";
import type { GameState } from "./stateMachine";
import { loadAudio, playAudio } from "./audio";
import { setUpMetronome } from "./metronome";

let gameState: GameState;
let { currentTime, bpm, songDuration } = await loadAudio();

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
  // const newInputs = inputs.updateInputs();
  // logic
  const newState = stateMachine.updateGame(inputs.inputState, gameState); // call all the things that change it
  if (gameState.needsAudio) {
    setUpMetronome(bpm);
    playAudio();
  } else {
    gameState.songBpm = bpm;
    gameState.songDuration = songDuration;
    gameState.timePassedSinceSongStarted = currentTime;
    gameState.needsAudio = false;
  }

  gameState = newState;

  // Render
  renderer.render(gameState);

  //TODO: audio system (adding fields to GameState, stop/play music)
  // audioSystem.handleAudio(gameState)
}
