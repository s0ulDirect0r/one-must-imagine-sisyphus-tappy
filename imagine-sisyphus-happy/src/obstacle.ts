// every beat, check if there are obstacles less than a predetermined max
// if there isn't, create a new random obstacle at the top of the grid
// then move every obstacle down in the beat

import { KeyState } from "./input"
import { GameState, GRID_HEIGHT, GRID_WIDTH, MAX_OBSTACLES } from "./stateMachine"

// mvp: generate an obstacle for every space press, and move each obstacle down by one 
export function updateObstacles(inputs: Map<string, KeyState>, gameState: GameState): GameState {
  // console.log("inputs: ", inputs)
  // for now, space press represents new beat
  if (inputs.get("Space")?.pressed ?? false) {
    gameState.trees.map(tree => {
      console.log(tree)
      tree.y = tree.y - 1
    })

    if (gameState.trees.length < MAX_OBSTACLES) {
      const newX = Math.floor(Math.random() * GRID_WIDTH - 1)
      const newY = GRID_HEIGHT - 1
      const newTree = {
        id: crypto.randomUUID(),
        x: newX,
        y: newY
      }

      const newTreeArray = [...gameState.trees, newTree]
      const newGameState = {
        ...gameState,
        trees: newTreeArray,
      }
      console.log(newGameState.trees)
      return newGameState
    }
  }

  return gameState
}