// every beat, check if there are obstacles less than a predetermined max
// if there isn't, create a new random obstacle at the top of the grid
// then move every obstacle down in the beat

import { KeyState } from "./input"
import { GameState, GRID_HEIGHT, GRID_WIDTH, MAX_OBSTACLES, Obstacle } from "./stateMachine"

export type Obstacle = {
  id: string;
  x: number;
  y: number;
};

// mvp: generate an obstacle for every space press, and move each obstacle down by one
// TODO: pass obstacle updates to renderer, make it it's own function?
// TODO: handle player movement? need to calculate elevation and player position
export function updateObstacles(inputs: Map<string, KeyState>, obstacles: Obstacle[]): Obstacle[]{
  // console.log("inputs: ", inputs)
  // for now, space press represents new beat
  // TODO: sync movement updates to metronome
  // TODO: might need to do filtering order to conform max obstacle size
  if (inputs.get("Space")?.pressed ?? false) {
    // TODO: obstacle movement may eventually need its own function
    const movedObstacles = obstacles.map(obs => ({ ...obs, y: obs.y - 1 }))
    const bounded = movedObstacles.filter(obs => obs.y >= 0)

    // TODO: possible to generate multiple obstacles per line?
    if (bounded.length < MAX_OBSTACLES) {
      bounded.push(generateObstacle());
    }

    // We use the clear-and-repopulate pattern
    // to maintain reference to the same array for closure purposes
    obstacles.length = 0
    obstacles.push(bounded)
  }
  return obstacles
}

function generateObstacle(): Obstacle {
  return {
    id: crypto.randomUUID(),
    x: Math.floor(Math.random() * (GRID_WIDTH - 1)),
    y: GRID_HEIGHT - 1,
  }
}
