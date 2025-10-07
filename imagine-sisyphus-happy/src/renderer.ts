import { Application, Assets, Sprite } from "pixi.js";
import type { GameState } from "./coordinator";
import { initializeUIElements, renderUI } from "./ui";
import { initDevtools } from "@pixi/devtools";

let app: Application;

// Initialize the application
export async function initialize(gameState) {
  // Create a new application
  app = new Application();
  initDevtools({ app });

  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  initializeUIElements(app);
}

// TODO: split rendering into the scene itself and the UI
// TODO: write the UI
export async function render(gameState: GameState) {
  renderUI(gameState.score, gameState.streak);
}
