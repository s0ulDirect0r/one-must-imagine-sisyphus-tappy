// every beat, check if there are obstacles less than a predetermined max
// if there isn't, create a new random obstacle at the top of the grid
// then move every obstacle down in the beat

import { KeyState } from "./input";
import * as PIXI from "pixi.js";
import * as fs from "fs"
import * as path from "path";
import {
  GameState,
  GRID_HEIGHT,
  GRID_WIDTH,
  MAX_OBSTACLES,
} from "./stateMachine";
import { Assets, Texture, Sprite, AnimatedSprite } from "pixi.js";

let obstacleTextures: AnimatedSprite[] = [];
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
  const girlPukeFrames = await loadObstacleTextures("girl-puking-obstacle")
  const animatedGirlSprite = new AnimatedSprite(girlPukeFrames)

  obstacleTextures.push(animatedGirlSprite)





}

async function loadObstacleTextures(folderPath: string) {
  let GIRL_OBSTACLE_TEXTURES = []

  for (let i = 0; i < 36; i++) {
    let filename = ""
    if (i < 10) {
      filename = `tile00${i}.png`

    } else {
      filename = `tile0${i}.png`
    }

    console.log(`/assets/${folderPath}/${filename}`)
    GIRL_OBSTACLE_TEXTURES.push(await PIXI.Assets.load(`/assets/${folderPath}/${filename}`));



  }

  return GIRL_OBSTACLE_TEXTURES



}




// TODO Rename this to be clearer about MAP bounds
function withinBounds(obstacle: Obstacle): boolean {
  console.log("HELLOHELLO")
  if (obstacle.y <= 600) {
    return true;
  }
  const toDelete: AnimatedSprite = myObstacles.get(obstacle.id);
  console.log("OBSTACLETODELETE", toDelete)
  toDelete?.parent!.removeChild(toDelete);
  toDelete.destroy();
  myObstacles.delete(obstacle.id);
  return false;
}

// how am i going to keep track of myObstacles?
// TODO: do we need to check if obstacle is already rendered?
export async function frame(app: Application, obstacles: Obstacle[]) {
  obstacles.forEach((obstacle) => {
    const obstacleSprite = myObstacles.get(obstacle.id);
    console.log("SPRITE", obstacleSprite)
    if (obstacleSprite) {
      obstacleSprite.position.set(obstacle.x, obstacle.y);
    } else {
      const newObstacle = obstacleTextures[0]// how to pass texture?
      newObstacle.position.set(obstacle.x, obstacle.y);
      //newObstacle.play()
      app.stage.addChild(newObstacle);
      myObstacles.set(obstacle.id, newObstacle);
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
    console.log("BOUNDED", bounded)

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
    console.log("SPAWNED", spawned)

    return spawned;
  }

  return obstacles;
}
