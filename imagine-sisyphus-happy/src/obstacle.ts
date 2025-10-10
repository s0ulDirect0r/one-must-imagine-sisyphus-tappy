// every beat, check if there are obstacles less than a predetermined max
// if there isn't, create a new random obstacle at the top of the grid
// then move every obstacle down in the beat

import { KeyState } from "./input";
import {
  GameState,
  GRID_HEIGHT,
  GRID_WIDTH,
  MAX_OBSTACLES,
} from "./stateMachine";
import { Assets, Texture, Sprite, AnimatedSprite } from "pixi.js";

let obstacleTexture: Texture;
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

export async function initFrame(obstacles: Obstacle[]): Promise<Sprite> {
  obstacleTexture = await Assets.load("/assets/tree.png");
}

// TODO Rename this to be clearer about MAP bounds
function withinBounds(obstacle: Obstacle): boolean {
  if (obstacle.y <= 600) {
    return true;
  }
  const toDelete: Sprite = myObstacles.get(obstacle.id);
  toDelete.parent!.removeChild(toDelete);
  toDelete.destroy();
  myObstacles.delete(obstacle.id);
  return false;
}

// how am i going to keep track of myObstacles?
// TODO: do we need to check if obstacle is already rendered?
export async function frame(app: Application, obstacles: Obstacle[]) {
  obstacles.forEach((obstacle) => {
    const obstacleSprite = myObstacles.get(obstacle.id);
    if (obstacleSprite) {
      obstacleSprite.position.set(obstacle.x, obstacle.y);
    } else {
      const newSprite = new Sprite(obstacleTexture); // how to pass texture?
      newSprite.position.set(obstacle.x, obstacle.y);
      app.stage.addChild(newSprite);
      myObstacles.set(obstacle.id, newSprite);
    }
  });
}

// mvp: generate an obstacle for every space press, and move each obstacle down by one
// TODO: pass obstacle updates to renderer, make it it's own function?
// TODO: handle player movement? need to calculate elevation and player position
export function updateObstacles(
  obstacles: Obstacle[],
  expectMove: boolean,
): Obstacle[] {
  // console.log("inputs: ", inputs)
  // for now, space press represents new beat
  // TODO: sync movement updates to metronome
  // TODO: might need to do filtering order to conform max obstacle size
  if (expectMove ?? false) {
    // TODO: obstacle movement may eventually need its own function
    const movedObstacles = obstacles.map((obs) => ({ ...obs, y: obs.y + 20 }));
    const bounded = movedObstacles.filter((obs) => withinBounds(obs));

    // TODO: possible to generate multiple obstacles per line?
    const spawned =
      bounded.length < MAX_OBSTACLES
        ? [
            ...bounded,
            {
              id: crypto.randomUUID(),
              x: Math.floor(Math.random() * (GRID_WIDTH - 1)),
              y: GRID_HEIGHT - 1,
            } as Obstacle,
          ]
        : bounded;

    return spawned;
  }

  return obstacles;
}
