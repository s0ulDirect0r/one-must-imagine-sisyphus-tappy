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
  ColorMatrixFilter,
} from "pixi.js";
import type { GameState } from "./stateMachine";
import * as ui from "./ui";
import { initDevtools } from "@pixi/devtools";
import * as background from "./background";
import { Obstacle } from "./obstacle";
import * as player from "./Player";
import * as screen from "./backgroundScreen";

let app: Application;
let obstacleTexture: Texture;
let lastState: GameState;
let colorMatrix: ColorMatrixFilter;

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

  const width = app.screen.width;
  const height = app.screen.height;

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const bg = await background.initFrame(width, height);
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

  // TODO
  const bgScreen = screen.initFrame(app);
  app.stage.addChild(bgScreen);

  const playerSprite = await player.initFrame(width, height, gameState.player);
  app.stage.addChild(playerSprite);

  const { elevationText, streakText, debugText, debugMetronomeText } =
    ui.initFrame(width, height);

  app.stage.addChild(elevationText);
  app.stage.addChild(streakText);
  // app.stage.addChild(debugText);
  // app.stage.addChild(debugMetronomeText);

  app.ticker.add((ticker) => {
    if (!lastState) return;
    drawScene(lastState, ticker); // pure draw call
  });
}

// TODO: split rendering into the scene itself and the UI
// TODO: write the UI
export async function render(state: GameState) {
  lastState = state; // atomic pointer swap
}

async function drawScene(state: GameState, ticker: Ticker) {
  renderUI(state.expectMove, state.elevation, state.streak, state.lost);
  renderBackgroundScreen(state.expectMove, app);
  renderObstacles(app, state.obstacles, state.expectMove);
  background.frame(state, ticker);
  screen.frame(state.expectMove, app);
  ui.frame(state.expectMove, state.elevation, state.streak);
  player.frame(state.player);
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
