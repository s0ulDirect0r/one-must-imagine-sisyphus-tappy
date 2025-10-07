import * as coordinator from "./coordinator";

function startGame() {
  coordinator.initializeGameState();
  coordinator.startGameLoop();

}
startGame();
