import { Application, Assets, Sprite, Text, TextStyle } from "pixi.js";
import type { GameState } from "./coordinator";
import { Tree } from "./stateMachine";
import { renderUI } from "./ui";

let app: Application;
let bunny: Sprite;
let treeTexture: any
let scoreText: Text;
let streakText: Text;

const myTrees: Map<string, Sprite> = new Map();

// Initialize the application
export async function initialize(gameState) {
  // Create a new application
  app = new Application();

  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Load the bunny texture
  const texture = await Assets.load("/assets/bunny.png");
  treeTexture = await Assets.load("/assets/tree.png");

  // Create a bunny Sprite
  bunny = new Sprite(texture);

  // Center the sprite's anchor point
  bunny.anchor.set(0.5);

  // Move the sprite to the center of the screen
  bunny.position.set(app.screen.width / 2, app.screen.height / 2);

  // Add the bunny to the stage
  app.stage.addChild(bunny);

  // create UI elements
  scoreText = new Text();
  streakText = new Text();

  scoreText.pivot.set(scoreText.width / 2, scoreText.height);
  scoreText.x = app.renderer.screen.width / 2;
  scoreText.y = app.renderer.screen.height;
  
  streakText.pivot.set(streakText.width / 2, 0);
  streakText.x = app.renderer.screen.width / 2;
  streakText.y = 0;

  app.stage.addChild(scoreText);
  app.stage.addChild(streakText);
}

// TODO: split rendering into the scene itself and the UI
// TODO: write the UI
export async function render(gameState: GameState) {
  bunny.position.set(gameState.x, gameState.y);
  renderTrees(gameState.trees);
  renderUI(streakText, scoreText, 1000000, 50);
}

function renderTrees(trees: Tree[]) {
  trees.forEach(tree => {
    const treeSprite = myTrees.get(tree.id)
    if (treeSprite) {
      treeSprite.position.set(tree.x, tree.y)
    } else {
      const newSprite = new Sprite(treeTexture);
      newSprite.position.set(tree.x, tree.y)
      app.stage.addChild(newSprite)
      myTrees.set(tree.id, newSprite)
    }
  })
}
