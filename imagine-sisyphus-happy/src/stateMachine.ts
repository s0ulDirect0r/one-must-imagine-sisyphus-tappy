import { inputState, KeyState } from "./input";
import { updateObstacles, type Obstacle } from "./obstacle";

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 15;
export const MAX_OBSTACLES = 12;

import { playAudio, isAudioPlaying, getCurrentAudioTime, loadAudio } from "./audio";
import { setUpMetronome, expectUserInput } from "./metronome";
import { Player, movePlayer } from "./Player";
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

// The initial values of gameState.
export const gameState: GameState = {
  player: {
    x: screen.width / 2,
    y: screen.height / 2 + 200, // TODO need app screen specifically?
    speed: 0.1,
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
): Partial<GameState> {
  let newGameState: Partial<GameState> = {};

  // check if Audio has been loaded in renderer
  if (gameState.needsAudio) {
    //play song
    playAudio();
  }

  if (isAudioPlaying()) {
    const currentTime = getCurrentAudioTime();
    const expected = expectUserInput(currentTime);
    newGameState.timePassedSinceSongStarted = currentTime;
    newGameState.expectMove = expected;
    newGameState.needsAudio = false;
  } else {
    // Just mark that we need to load audio next tick
    newGameState.needsAudio = true;
  }

  if (inputState.get("Space")?.pressed && gameState.expectMove) {
    let elevationChange = gameState.elevation + 100;
    let streakChange = gameState.streak + 1;

    newGameState.elevation = elevationChange;
    newGameState.streak = streakChange;

    newGameState.player = movePlayer(gameState.player);
  }
  // } else if (inputState.get("Space")?.pressed && !newGameState.expectMove) {
  //   newGameState = punishPlayer(newGameState);
  // }

  newGameState.obstacles = updateObstacles(inputs, gameState.obstacles);
  return newGameState;
}





function punishPlayer(gameState: GameState) {
  return {
    ...gameState,
    streak: 0,
  };
}
