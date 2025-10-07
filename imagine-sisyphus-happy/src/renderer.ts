import { Application, Assets, Sprite } from "pixi.js";
import type { GameState } from "./coordinator";
import { Tree } from "./stateMachine";
import { initializeUIElements, renderUI } from "./ui";
import { initDevtools } from "@pixi/devtools";

let app: Application;
let treeTexture: any

const myTrees: Map<string, Sprite> = new Map();

// Initialize the application
export async function initialize(gameState) {
  // Create a new application
  app = new Application();
  initDevtools({ app });

  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  treeTexture = await Assets.load("/assets/tree.png");

  initializeUIElements(app);
}

// TODO: split rendering into the scene itself and the UI
// TODO: write the UI
export async function render(gameState: GameState) {
  renderTrees(gameState.trees);
  renderUI(gameState.score, gameState.streak);
}
