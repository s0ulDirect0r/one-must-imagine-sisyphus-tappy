import { KeyState } from "./input";
import { updateObstacles } from "./obstacle";

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 15;
export const MAX_OBSTACLES = 12;

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
  trees: Tree[]
};

export type Tree = {
  id: string;
  x: number;
  y: number;
};

export const initialGameState: GameState = {
  x: 100,
  y: 100,
  bpm: 0,
  elevation: 0,
  score: 0,
  streak: 0,
  trees: [],
  songBpm: 0,
  timePassedSinceSongStarted: 0,
  songDuration: 0,
  expectMove: false,
  needsAudio: true

};


export function updateGame(inputs: Map<string, KeyState>, gameState: GameState) {
  let newGameState: GameState

  // check if Audio has been loaded in renderer
  if (gameState.needsAudio) {
    //play song
    playAudio();
  }

  if (isAudioPlaying()) {
    const expected = expectUserInput(gameState.timePassedSinceSongStarted);
    newGameState = {
      ...gameState,
      timePassedSinceSongStarted: getCurrentAudioTime(),
      expectMove: expected,
      needsAudio: false
    };
  } else {
    // Just mark that we need to load audio next tick
    newGameState = gameState
    gameState.needsAudio = true
  }  
  
  if (inputs.get("Space")?.pressed) {
    newGameState = movePlayer(gameState);
  }
  newGameState = updateObstacles(inputs, newGameState);
  return newGameState;
}

// An example of some logic that we will move to a component later.
function movePlayer(gameState: GameState) {
  // A player has pressed the up key and the player is moving!
  // If "beatWindow = open", move the player forward and increase elevation
  // if "beatWindow = closed" player does NOT move forward, log a miss
  let elevationChange;
  let streakChange;

  // TODO: Change if argument to gameState.expectMove
  if (true) {
    elevationChange = gameState.elevation + 100;
    streakChange = gameState.streak + 1;
  } else {
    elevationChange = gameState.elevation;
    streakChange = 0;
  }

  const newGameState = {
    ...gameState,
    elevation: elevationChange,
    streak: streakChange,
  };

  return newGameState;
}
