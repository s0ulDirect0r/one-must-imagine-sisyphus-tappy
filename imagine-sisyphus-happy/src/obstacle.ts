// every beat, check if there are obstacles less than a predetermined max
// if there isn't, create a new random obstacle at the top of the grid
// then move every obstacle down in the beat

import { KeyState } from "./input"
import { GameState, GRID_HEIGHT, GRID_WIDTH, MAX_OBSTACLES } from "./stateMachine"

// mvp: generate an obstacle for every space press, and move each obstacle down by one
// TODO: pass obstacle updates to renderer, make it it's own function?
// TODO: handle player movement? need to calculate elevation and player position
export function updateObstacles(inputs: Map<string, KeyState>, gameState: GameState): GameState {
  // console.log("inputs: ", inputs)
  // for now, space press represents new beat
  // TODO: sync movement updates to metronome
  // TODO: might need to do filtering order to conform max obstacle size
  if (inputs.get("Space")?.pressed ?? false) {
    // TODO: obstacle movement may eventually need its own function
    const movedTrees = gameState.trees.map(tree => ({ ...tree, y: tree.y - 1 }))
    const boundedTrees = movedTrees.filter(tree => tree.y >= 0)

    // TODO: possible to generate multiple obstacles per line? 
    if (gameState.trees.length < MAX_OBSTACLES) {
      const newX = Math.floor(Math.random() * (GRID_WIDTH - 1))
      const newY = GRID_HEIGHT - 1
      const newTree = {
        id: crypto.randomUUID(),
        x: newX,
        y: newY
      }

      const newTreeArray = [...boundedTrees, newTree]
      const newGameState = {
        ...gameState,
        trees: newTreeArray,
      }
      console.log(newGameState.trees)
      return newGameState
    } else {
      const newGameState = {
        ...gameState,
        trees: boundedTrees
      }
      console.log(newGameState.trees)
      return newGameState
    }
  }
  return gameState
}