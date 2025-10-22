import * as stateMachine from "./stateMachine";
import * as renderer from "./renderer";
import * as inputs from "./input";
import { getCurrentAudioTime, loadAudio, playAudio } from "./audio";

let gameState = stateMachine.gameState;
let bpm: number;
let songDuration: number;
let loopInterval: string | number | ReturnType<typeof setInterval> | undefined;
let startMenu = true;

async function initializeAudio() {
  const audioData = await loadAudio();
  bpm = audioData.bpm;
  songDuration = audioData.songDuration;
}

export async function initializeGameState(): Promise<void> {
  await initializeAudio();
  inputs.initialize();
  // passing it off to the renderer
  renderer.initialize(gameState);
}

function waitForPlayerInput(): void {
  if (inputs.inputState.get("Space")) {
    startMenu = false;
  }
}

export function startGameLoop() {
  // start the game loop forever.
  loopInterval = setInterval(() => {
    if (startMenu) {
      waitForPlayerInput();
    } else {
      gameLoop();
    }
  }, 16);
}

export function endGameLoop() {
  if (typeof loopInterval === "number") {
    clearInterval(loopInterval);
  }
}

// This will run 60x per second.
export function gameLoop() {
  // logic
  const newState = stateMachine.updateGame(inputs.inputState, gameState); // call all the things that change it
  if (gameState.needsAudio) {
    playAudio();
    newState.songStartTime = getCurrentAudioTime();
    console.log("STARTING", newState.songStartTime);
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
