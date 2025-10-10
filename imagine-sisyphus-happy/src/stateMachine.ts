import { inputState, KeyState } from "./input";
import { judge } from "./judge";
import { updateObstacles, type Obstacle } from "./obstacle";

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 15;
export const MAX_OBSTACLES = 1;
export const TIME_OFFSET = 0.05;

import { getCurrentAudioTime } from "./audio";
import { isInBeatWindow } from "./metronome";
import {
  Player,
  movePlayer,
  shiftPlayer,
  checkCollisionWithObstacle,
} from "./Player";
//import { movePlayer } from "./Player";
export type GameState = {
  player: Player;
  bpm: number;
  elevation: number;
  score: number;
  streak: number;
  missStreak: number;
  debug: boolean;
  obstacles: Obstacle[];
  songBpm: number;
  timePassedSinceSongStarted: number;
  songDuration: number;
  expectMove: boolean;
  needsAudio: boolean;
  lost: boolean;
  songStartTime: number;
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
  missStreak: 0,
  debug: true,
  obstacles: [],
  songBpm: 0,
  timePassedSinceSongStarted: 0,
  songDuration: 0,
  expectMove: false,
  needsAudio: true,
  lost: false,
  songStartTime: 0,
};

export function updateGame(
  inputs: Map<string, KeyState>,
  gameState: GameState,
): Partial<GameState> {
  let newGameState: Partial<GameState> = {};
  let expected = false;

  // check if Audio has been loaded in renderer
  if (gameState.needsAudio) {
    //play song
    const now = performance.now() / 1000;

    if (!gameState.songStartTime) {
      newGameState.songStartTime = now;
    }
  }

  if (!gameState.needsAudio) {

    const elapsed = getCurrentAudioTime() - gameState.songStartTime;
    const expected = isInBeatWindow(elapsed, 136, 0);
    newGameState.expectMove = expected;
    const currentTime = getCurrentAudioTime() + TIME_OFFSET;

    newGameState.timePassedSinceSongStarted = currentTime;

    console.log({
      currentTime,
      songStartTime: gameState.songStartTime,
      elapsed: currentTime - gameState.songStartTime,
      bpm: 136,
      secondsPerBeat: 60 / gameState.songBpm,
      expected,
    });

  } else {
    // Just mark that we need to load audio next tick
    newGameState.needsAudio = true;
  }

  gameState.obstacles.map((obstacle) => {
    if (checkCollisionWithObstacle(gameState.player, obstacle)) {
      console.error("HITTING");
      // Confirmed to hit... but.. What to do?
    }
  });

  const spacePressed = inputState.get("Space")?.justPressed;
  const judgement = judge(
    spacePressed,
    newGameState.expectMove,
    gameState.elevation,
    gameState.streak,
    gameState.missStreak,
  );
  newGameState = { ...newGameState, ...judgement };

  const newPlayer: Partial<Player> = gameState.player;

  if (judgement && judgement.elevation) {
    Object.assign(newPlayer, movePlayer(gameState.player));
  }
  Object.assign(newPlayer, shiftPlayer(gameState.player));

  newGameState.obstacles = updateObstacles(
    gameState.obstacles,
    gameState.expectMove,
  );

  return newGameState;
}
