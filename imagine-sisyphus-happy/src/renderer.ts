import { Application, Assets, Sprite, Container, Graphics } from "pixi.js";
import type { GameState } from "./coordinator";
import { Tree } from "./stateMachine";
import { renderUI } from "./ui";
import { initDevtools } from "@pixi/devtools";

let app: Application;
let bunny: Sprite;
let treeTexture: any
const myTrees: Map<string, Sprite> = new Map();

// Initialize the application
export async function initialize(gameState) {
  // Create a new application
  app = new Application();
  initDevtools({ app });

  await app.init({
    background: "#1099bb",
    resizeTo: window,
  });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Load the bunny texture
  const texture = await Assets.load("/assets/bunny.png");
  treeTexture = await Assets.load("/assets/tree.png");

  if (gameState.debug) {
    const container = initializeGrid();
    app.stage.addChild(container);
  }

  // Create a bunny Sprite
  bunny = new Sprite(texture);

  // Center the sprite's anchor point
  bunny.anchor.set(0.5);

  // Move the sprite to the center of the screen
  bunny.position.set(app.screen.width / 2, app.screen.height / 2);

  // Add the bunny to the stage
  app.stage.addChild(bunny);
}

// TODO: split rendering into the scene itself and the UI
// TODO: write the UI
export async function render(gameState: GameState) {
  bunny.position.set(gameState.x, gameState.y);
  renderTrees(gameState.trees);
  renderUI(gameState.score);
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

function renderTrees(trees: Tree[]) {
  trees.forEach((tree) => {
    const treeSprite = myTrees.get(tree.id);
    if (treeSprite) {
      treeSprite.position.set(tree.x, tree.y);
    } else {
      const newSprite = new Sprite(treeTexture);
      newSprite.position.set(tree.x, tree.y);
      app.stage.addChild(newSprite);
      myTrees.set(tree.id, newSprite);
    }
  });
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
