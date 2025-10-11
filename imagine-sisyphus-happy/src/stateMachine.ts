import { inputState, KeyState } from "./input";
import { judge } from "./judge";
import { updateObstacles, type Obstacle } from "./obstacle";

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 15;
export const MAX_OBSTACLES = 3;
export const OBSTACLE_WINDOW = 70;
export const TIME_OFFSET = 0.07;
export const CAMERA_EFFECT = 0.332;

import { getCurrentAudioTime } from "./audio";
import { isInBeatWindow } from "./metronome";
import {
  Player,
  anime as playerAnime,
  movePlayer,
  shiftPlayer,
  bumpPlayerDown,
  checkCollisionWithObstacle,
} from "./Player";
import {
  Enemy,
  moveEnemy,
  calculateDirectionVector,
  anime as enemyAnime,
  bumpEnemyDown,
} from "./enemy";

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
  passedDistanceThreshold: boolean;
};

const THRESHOLD = 100;
const THRESHOLD_BUMP = 777;
// The initial values of gameState.
export const gameState: GameState = {
  player: {
    x: screen.width / 2,
    y: screen.height / 2 + 200, // TODO need app screen specifically?
    speed: 0.1,
  },
  enemy: {
    x: screen.width / 4,
    y: screen.height / 2 + 400,
    speed: 2.5,
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
  } else {
    // Just mark that we need to load audio next tick
    newGameState.needsAudio = true;
  }

  gameState.obstacles.map((obstacle) => {
    if (checkCollisionWithObstacle(gameState.player, obstacle)) {
      console.error("HITTING", obstacle.id);
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

  const newPlayer: Partial<Player> = {};

  if (judgement && judgement.elevation) {
    Object.assign(newPlayer, movePlayer(gameState.player, true));
  } else {
    Object.assign(newPlayer, movePlayer(gameState.player, false));
  }
  Object.assign(newPlayer, shiftPlayer(gameState.player));

  newGameState.obstacles = updateObstacles(
    gameState.obstacles,
    gameState.expectMove,
    gameState.player,
  );

  const newEnemy: Partial<Enemy> = gameState.enemy;
  const vectors = calculateDirectionVector(gameState.player, gameState.enemy);
  Object.assign(
    newEnemy,
    moveEnemy(gameState.expectMove, gameState.enemy, vectors),
  );

  newGameState.enemy = { ...gameState.enemy, ...newEnemy };

  if (vectors.distanceToPlayer < 8.5) {
    newGameState.lost = true;
  }

  newGameState.passedDistanceThreshold = gameState.player.y < THRESHOLD;
  if (gameState.passedDistanceThreshold) {
    newPlayer.y = gameState.player.y + THRESHOLD_BUMP;
    newEnemy.y = gameState.enemy.y + THRESHOLD_BUMP;

    // Object.assign(newPlayer, bumpPlayerDown(newPlayer));
    // Object.assign(newEnemy, bumpEnemyDown(newEnemy));
    newGameState.passedDistanceThreshold = false;
  }

  newGameState.player = { ...gameState.player, ...newPlayer };
  newGameState.enemy = { ...gameState.enemy, ...newEnemy };

  return newGameState;
}
