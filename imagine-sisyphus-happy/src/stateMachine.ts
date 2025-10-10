import { inputState, KeyState } from "./input";
import { judge } from "./judge";
import { updateObstacles, type Obstacle } from "./obstacle";

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 15;
export const MAX_OBSTACLES = 1;
export const TIME_OFFSET = 0.07;

import { getCurrentAudioTime } from "./audio";
import { isInBeatWindow } from "./metronome";
import { Player, movePlayer, shiftPlayer } from "./Player";
import { Enemy, moveEnemy, calculateDirectionVector } from "./enemy";
//import { movePlayer } from "./Player";
export type GameState = {
  player: Player;
  enemy: Enemy;
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
  enemy: {
    x: 20,
    y: 700,
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

    if (!gameState.songStartTime) {
      newGameState.songStartTime = getCurrentAudioTime();
    }
  }

  if (!gameState.needsAudio) {

    const elapsed = getCurrentAudioTime() - gameState.songStartTime;
    const expected = isInBeatWindow(elapsed, 136, 0);
    newGameState.expectMove = expected;
    const currentTime = getCurrentAudioTime() - TIME_OFFSET;

    newGameState.timePassedSinceSongStarted = currentTime;
    if (expected) { console.log("TAP") }
    else { console.log("DONT TAP") }
  } else {
    // Just mark that we need to load audio next tick
    newGameState.needsAudio = true;
  }

  const spacePressed = inputState.get("Space")?.justPressed;
  const judgement = judge(
    spacePressed,
    newGameState.expectMove,
    gameState.elevation,
    gameState.streak,
    gameState.missStreak,
  );
  newGameState = { ...newGameState, ...judgement };

  const newPlayer: Partial<Player> = {};

  if (judgement && judgement.elevation) {
    Object.assign(newPlayer, movePlayer(gameState.player));
  }
  Object.assign(newPlayer, shiftPlayer(gameState.player));

  newGameState.obstacles = updateObstacles(
    gameState.obstacles,
    gameState.expectMove,
  );
  newGameState.player = { ...gameState.player, ...newPlayer };

  const newEnemy: Partial<Enemy> = gameState.enemy;

  return newGameState;
}
