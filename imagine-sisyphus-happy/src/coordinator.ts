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
  // If we need to load audio and it's not already loading
  if (gameState.needsAudio) {

    loadAudio()
      .then(({ currentTime, bpm, songDuration }) => {
        gameState.songBpm = bpm;
        gameState.songDuration = songDuration;
        gameState.timePassedSinceSongStarted = currentTime;
        setUpMetronome(bpm)

        playAudio();

        // Mark audio as ready
        gameState.needsAudio = false;
        gameState.isLoadingAudio = false;
      })
      .catch((err) => {
        console.error("Audio failed to load:", err);
        gameState.isLoadingAudio = false;
      });
  }

  // Update logic
  const newState = stateMachine.updateGame(gameState);
  gameState = newState;

  // Render
  renderer.render(gameState);
}
