import { inputState, KeyState } from "./input";
import { updateObstacles } from "./obstacle";

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 15;
export const MAX_OBSTACLES = 12;

import { playAudio, isAudioPlaying, getCurrentAudioTime, loadAudio } from "./audio";
import { setUpMetronome, expectUserInput } from "./metronome";
import { Player, movePlayer } from "./Player";
import { renderUI } from "./ui";
//import { movePlayer } from "./Player";
export type GameState = {
  player: Player;
  bpm: number;
  elevation: number;
  score: number;
  streak: number;
  debug: boolean;
  obstacles: Obstacle[];
  songBpm: number;
  timePassedSinceSongStarted: number;
  songDuration: number;
  expectMove: boolean;
  needsAudio: boolean;
};

export type Obstacle = {
  id: string;
  x: number;
  y: number;
};



export const initialGameState: GameState = {
  player: {
    x: screen.width / 2,
    y: screen.height / 2 + 200, // TODO need app screen specifically?
    speed: 0.1
  },
  bpm: 0,
  elevation: 0,
  score: 0,
  streak: 0,
  debug: true,
  obstacles: [],
  songBpm: 0,
  timePassedSinceSongStarted: 0,
  songDuration: 0,
  expectMove: false,
  needsAudio: true,
};

export function updateGame(
  inputs: Map<string, KeyState>,
  gameState: GameState,
) {
  let newGameState: GameState;

  // check if Audio has been loaded in renderer
  if (gameState.needsAudio) {
    //play song
    playAudio();
  }

  if (isAudioPlaying()) {
    const currentTime = getCurrentAudioTime() + .05
    const expected = expectUserInput(currentTime);
    newGameState = {
      ...gameState,
      timePassedSinceSongStarted: currentTime,
      expectMove: expected,
      needsAudio: false,
    };
  } else {
    // Just mark that we need to load audio next tick
    newGameState = gameState;
    gameState.needsAudio = true;
  }


  if (inputState.get("Space")?.pressed && newGameState.expectMove) {
    let elevationChange = gameState.elevation + 100;
    let streakChange = gameState.streak + 1;

    newGameState = {
      ...gameState,
      elevation: elevationChange,
      streak: streakChange,
    };

    newGameState = movePlayer(newGameState);
  }


  // } else if (inputState.get("Space")?.pressed && !newGameState.expectMove) {
  //   newGameState = punishPlayer(newGameState);
  // }

  newGameState = updateObstacles(inputs, newGameState);
  return newGameState;
}







function punishPlayer(gameState: GameState) {
  return {
    ...gameState,
    streak: 0,
  };
}
