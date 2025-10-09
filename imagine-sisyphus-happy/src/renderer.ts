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
import { loadAudio } from "./audio";
import { setUpMetronome } from "./metronome";
import * as background from "./background";
import { initializePlayer } from "./Player";
import { Obstacle } from "./obstacle";

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

  // const myGrid = initializeGrid();
  // app.stage.addChild(myGrid);
  initializeUIElements(app);
  initializePlayer(app, gameState.player);
}

// TODO: split rendering into the scene itself and the UI
// TODO: write the UI
export async function render(gameState: GameState) {
  renderUI(gameState.expectMove, gameState.elevation, gameState.streak);
  renderObstacles(app, gameState.obstacles, gameState.expectMove);
}

function initializeGrid() {
  const grid = buildGrid(new Graphics()).stroke({
    color: 0xff0000,
    pixelLine: true,
    width: 1,
  });

  // To center the grid in the container, use half of
  // `gridCellWidth` * `cellPixelLength` => 10*10 = 50
  // `gridCellHeight` * `cellPixelLength` => 15*10 = 75
  grid.position.set(-50, -75);

  const container = new Container();

  container.addChild(grid);
  container.position.set(app.screen.width / 2, app.screen.height / 2);
  container.scale = 4;
  return container;
}
/**
 * Creates a grid pattern using Graphics lines
 * @param graphics - The Graphics object to draw on
 * @returns The Graphics object with the grid drawn
 */
function buildGrid(graphics: Graphics) {
  // TODO Connect the grid to the gamestate information about the grid.
  const gridCellWidth = 15;
  const gridCellHeight = 10;
  const cellPixelLength = 10;

  graphics = graphics.stroke({ width: 1, color: 0xff0000, pixelLine: true });
  // Draw 10 vertical lines spaced cellPixelLength pixels apart
  for (let i = 0; i <= gridCellHeight; i++) {
    // Move to top of each line (x = i*10, y = 0)
    graphics
      .moveTo(i * cellPixelLength, 0)
      // Draw down to bottom (x = i*10, y = 100)
      .lineTo(i * cellPixelLength, gridCellWidth * cellPixelLength);
  }

  graphics = graphics.stroke({ width: 1, color: 0x00ffff, pixelLine: true });
  // Draw 10 horizontal lines spaced 10 pixels apart
  for (let i = 0; i <= gridCellWidth; i++) {
    // Move to start of each line (x = 0, y = i*10)
    graphics
      .moveTo(0, i * cellPixelLength)
      // Draw across to end (x = 100, y = i*10)
      .lineTo(gridCellHeight * cellPixelLength, i * cellPixelLength);
  }

  return graphics;
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