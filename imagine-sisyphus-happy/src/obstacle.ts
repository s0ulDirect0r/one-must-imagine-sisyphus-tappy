// every beat, check if there are obstacles less than a predetermined max
// if there isn't, create a new random obstacle at the top of the grid
// then move every obstacle down in the beat

import { KeyState } from "./input";
import { checkCollisionWithObstacle, Player } from "./Player";
import {
  GameState,
  GRID_HEIGHT,
  GRID_WIDTH,
  MAX_OBSTACLES,
  OBSTACLE_WINDOW,
} from "./stateMachine";
import { Assets, Texture, Sprite, AnimatedSprite } from "pixi.js";

let obstacleTextures: Texture[][] = [];
let sprite: Sprite;
const myObstacles: Map<string, Sprite> = new Map();

export type Obstacle = {
  id: string;
  x: number;
  y: number;
  // TODO Create additional variables to do something with it upon collision
};

// TODO this is a temporary WIDTH/HEIGHT
export const WIDTH = 150;
export const HEIGHT = 150;

export async function initFrame(obstacles: Obstacle[]) {
  const girlObst = await loadObstacleTextures("girl-puking-obstacle");
  obstacleTextures.push(girlObst)
  const stripperObst = await loadObstacleTextures("stripper")
  obstacleTextures.push(stripperObst)
  const homelessObst = await loadObstacleTextures("homeless")
  obstacleTextures.push(homelessObst)

}

async function loadObstacleTextures(folderPath: string): Promise<Texture[]> {
  let OBSTACLE_TEXTURES = [];

  for (let i = 0; i < 36; i++) {
    let filename = ""
    if (i < 10) {
      filename = `tile00${i}.png`

    } else {
      filename = `tile0${i}.png`
    }

    console.log(`/assets/${folderPath}/${filename}`);
    OBSTACLE_TEXTURES.push(
      await Assets.load(`/assets/${folderPath}/${filename}`),
    );
  }

  return OBSTACLE_TEXTURES



}




function withinBounds(obstacle: Obstacle): boolean {
  if (obstacle.y <= 600) {
    return true;
  }
  if (myObstacles.has(obstacle.id)) {
    const toDelete: AnimatedSprite = myObstacles.get(obstacle.id);
    toDelete?.parent!.removeChild(toDelete);
    toDelete.destroy();
    myObstacles.delete(obstacle.id);
  }
  return false;
}

// how am i going to keep track of myObstacles?
// TODO: do we need to check if obstacle is already rendered?
export async function frame(app: Application, obstacles: Obstacle[]) {
  obstacles.forEach((obstacle) => {
    if (myObstacles.has(obstacle.id)) {
      const obstacleSprite = myObstacles.get(obstacle.id)!;
      obstacleSprite.position.set(obstacle.x, obstacle.y);
    } else {
      const random = Math.floor(Math.random() * 2);

      const newObstacle = new AnimatedSprite(obstacleTextures[random]);
      console.log("NEWOBST", newObstacle); // how to pass texture?
      newObstacle.position.set(obstacle.x, obstacle.y);
      newObstacle.play();
      app.stage.addChild(newObstacle);
      myObstacles.set(obstacle.id, newObstacle);
    }
  });
}

export function moveObstacles(
  obstacles: Obstacle[],
  player: Player,
): Obstacle[] {
  const movedObstacles = obstacles.map((obs) => {
    if (!checkCollisionWithObstacle(player, obs)) {
      return { ...obs, y: obs.y + 5 };
    } else {
      return { ...obs };
    }
  });

  return movedObstacles;
}

// mvp: generate an obstacle for every space press, and move each obstacle down by one
// TODO: pass obstacle updates to renderer, make it it's own function?
// TODO: handle player movement? need to calculate elevation and player position
export function updateObstacles(
  obstacles: Obstacle[],
  expectMove: boolean,
  player: Player,
): Obstacle[] {
  // console.log("inputs: ", inputs)
  // for now, space press represents new beat
  // TODO: sync movement updates to metronome
  // TODO: might need to do filtering order to conform max obstacle size
  if (expectMove) {
    // TODO: obstacle movement may eventually need its own function
    // (oct10;1730) looks like today is that day.
    // const movedObstacles = obstacles.map((obs) => ({ ...obs, y: obs.y + 5 }));
    const movedObstacles = moveObstacles(obstacles, player);
    const bounded = movedObstacles.filter((obs) => withinBounds(obs));
    console.log("BOUNDED", bounded);

    const obs_max = OBSTACLE_WINDOW / 2 + player.x;
    const obs_min = OBSTACLE_WINDOW / 2 - player.x;
    // TODO: possible to generate multiple obstacles per line?
    const spawned =
      bounded.length < MAX_OBSTACLES
        ? [
          ...bounded,
          {
            id: crypto.randomUUID(),
            x: Math.floor(Math.random() * (obs_max - obs_min) + obs_min),
            y: 10,
          } as Obstacle,
        ]
        : bounded;
    console.log("SPAWNED", spawned);

    return spawned;
  }

  return obstacles;
}
