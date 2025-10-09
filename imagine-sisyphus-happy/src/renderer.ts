import {
  Application,
  Assets,
  Sprite,
  Container,
  Graphics,
  Ticker,
  Text,
  TextStyle,
} from "pixi.js";
import type { GameState } from "./stateMachine";
import { initializeUIElements, renderUI } from "./ui";
import { initDevtools } from "@pixi/devtools";
import * as background from "./background";
import { initializePlayer } from "./Player";
import {
  initializeBackgroundScreen,
  renderBackgroundScreen,
} from "./backgroundScreen";

let app: Application;

// Initialize the application
export async function initialize(gameState: GameState) {
  // Create a new application
  app = new Application();
  initDevtools({ app });

  await app.init({
    background: "#1099bb",
    resizeTo: window,
  });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const bg = await background.init(app.screen.width, app.screen.height);
  app.stage.addChild(bg);

  app.ticker.add((ticker) => {
    background.frame(ticker);
  });

  // const myGrid = initializeGrid();
  // app.stage.addChild(myGrid);
  initializeUIElements(app);
  initializePlayer(app, gameState.player);

  const bgScreen = initializeBackgroundScreen(app);
  app.stage.addChild(bgScreen);
}

// TODO: split rendering into the scene itself and the UI
// TODO: write the UI
export async function render(gameState: GameState) {
  renderUI(gameState.expectMove, gameState.elevation, gameState.streak);
  renderBackgroundScreen(gameState.expectMove, app);
}
