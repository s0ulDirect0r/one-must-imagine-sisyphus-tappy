import { playAudio, isAudioPlaying, getCurrentAudioTime, loadAudio } from "./audio";
import { setUpMetronome, expectUserInput } from "./metronome";
export type GameState = {
  x: number;
  y: number;
  bpm: number;
  elevation: number;
  score: number;
  streak: number;
  songBpm: number;
  timePassedSinceSongStarted: number;
  songDuration: number;
  expectMove: boolean;
  needsAudio: boolean;
};

export const initialGameState: GameState = {
  x: 100,
  y: 100,
  bpm: 0,
  elevation: 0,
  score: 0,
  streak: 0,
  songBpm: 0,
  timePassedSinceSongStarted: 0,
  songDuration: 0,
  expectMove: false,
  needsAudio: true

};


export function updateGame(gameState: GameState) {
  let newGameState = movePlayer(gameState);
  // check if Audio has been loaded in renderer
  if (gameState.needsAudio) {

    //play song
    playAudio();

  }

  if (isAudioPlaying()) {
    const expected = expectUserInput(newGameState.timePassedSinceSongStarted);
    newGameState = {
      ...newGameState,
      timePassedSinceSongStarted: getCurrentAudioTime(),
      expectMove: expected,
      needsAudio: false
    };
  } else {
    // Just mark that we need to load audio next tick
    newGameState.needsAudio = true;
  }

  return newGameState;








  // We will mutate newGameState however necessary to match
  // the current inputs and outputs and obstacles and etc.
  // These will be from various different components
  // and from StateMachine

  // Communicate with State Machine
  // Communicate with Audio
  // Communicate with Renderer

}

// An example of some logic that we will move to a component later.
function movePlayer(gameState: GameState) {
  const newGameState = {
    ...gameState,
    x: gameState.x + 1,
  };
  return newGameState;
}
