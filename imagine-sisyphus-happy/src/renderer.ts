import { Application, Assets, Sprite } from "pixi.js";
import type { GameState } from "./coordinator";
import { playAudio } from "./audio";
import { startGame } from "./stateMachine";

let app;
let bunny;

// Initialize the application
export async function initialize(gameState) {
  // Create a new application
  app = new Application();

  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Load the bunny texture
  const texture = await Assets.load("/assets/bunny.png");

  // Create a bunny Sprite
  bunny = new Sprite(texture);

  //Create button to start game 
  const button = await Assets.load("/assets/bunny.png");
  const sprite = new Sprite(button);
  sprite.x = 300;
  sprite.y = 200;
  sprite.interactive = true; // 👈 make it clickable
  sprite.cursor = "pointer"; // optional: show hand cursor

  // Add a click listener
  sprite.on("pointerdown", (event) => {
    startGame()
  });

  // Add to stage
  app.stage.addChild(sprite);

  // Center the sprite's anchor point
  bunny.anchor.set(0.5);

  // Move the sprite to the center of the screen
  bunny.position.set(app.screen.width / 2, app.screen.height / 2);

  // Add the bunny to the stage
  app.stage.addChild(bunny);
}

export async function render(gameState) {



  bunny.position.set(gameState.x, gameState.y);

  // Listen for animate update
  app.ticker.add((time) => {
    // Just for fun, let's rotate mr rabbit a little.
    // * Delta is 1 if running at 100% performance *
    // * Creates frame-independent transformation *
    bunny.rotation += 0.1 * time.deltaTime;
  });
}
