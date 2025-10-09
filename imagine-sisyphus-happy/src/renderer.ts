import {
  Application,
  Assets,
  Sprite,
  Container,
  Graphics,
  Ticker,
  Text,
  TextStyle,
  Texture,
} from "pixi.js";
import type { GameState } from "./stateMachine";
import { initializeUIElements, renderUI } from "./ui";
import { initDevtools } from "@pixi/devtools";
import * as background from "./background";
import { initializePlayer } from "./Player";
import { Obstacle } from "./obstacle";
import {
  initializeBackgroundScreen,
  renderBackgroundScreen,
} from "./backgroundScreen";

let app: Application;
let obstacleTexture: Texture;

// Initialize the application
export async function initialize(gameState: GameState) {
  // Create a new application
  app = new Application();
  initDevtools({ app });

  obstacleTexture = await Assets.load("/assets/tree.png");

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

  const { width, height } = app.screen;
  const borderWidth = 10;
  const holeWidth = width - borderWidth * 2;
  const holeHeight = height - borderWidth * 2;
  const border = new Graphics()
    .rect(0, 0, width, height)
    .fill(0xffffff)
    .rect(borderWidth, borderWidth, holeWidth, holeHeight)
    .cut();

  const animationDuration = 250;
  app.stage.addChild(border);
  // TODO: implement border fade with background logic??
  // app.ticker.add((ticker) => {
  //   if (gameState.expectMove) {
  //     border.alpha = 1;
  //   }
  //   border.alpha -= ticker.deltaMS;
  // });

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
  renderObstacles(app, gameState.obstacles, gameState.expectMove);
  renderBackgroundScreen(gameState.expectMove, app);
}

const myObstacles: Map<string, Sprite> = new Map();

// how am i going to keep track of myObstacles?
// TODO: do we need to check if obstacle is already rendered?
export async function renderObstacles(app: Application, obstacles: Obstacle[]) {
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