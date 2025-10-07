import { Application, Assets, Sprite } from "pixi.js";
import { startGameLoop, type GameState } from "./coordinator";
import { playAudio } from "./audio";
import { startGame } from "./stateMachine";

let app;
let bunny;
let metroSprite: Sprite;

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

  const button = await Assets.load("/assets/bunny.png");
  const startButton = new Sprite(button);
  startButton.x = 300;
  startButton.y = 200;
  startButton.interactive = true; // 👈 make it clickable
  startButton.cursor = "pointer"; // optional: show hand cursor

  // Add a click listener
  startButton.on("pointerdown", (event) => {
    startGameLoop()

  });

  // Add to stage
  app.stage.addChild(startButton);

  const metronome = await Assets.load("/assets/bunny.png");
  metroSprite = new Sprite(button);
  metroSprite.x = 100;
  metroSprite.y = 100;
  app.stage.addChild(metroSprite)


  // Center the sprite's anchor point
  bunny.anchor.set(0.5);

  // Move the sprite to the center of the screen
  bunny.position.set(app.screen.width / 2, app.screen.height / 2);

  // Add the bunny to the stage
  app.stage.addChild(bunny);
}

export async function render(gameState) {
  console.log("STATSATATAT", gameState.expectMove)
  if (gameState.expectMove === true) {

    metroSprite.x = 120

  } else {
    metroSprite.x = 0
  }



  bunny.position.set(gameState.x, gameState.y);

  // Listen for animate update
  app.ticker.add((time) => {
    // Just for fun, let's rotate mr rabbit a little.
    // * Delta is 1 if running at 100% performance *
    // * Creates frame-independent transformation *
    bunny.rotation += 0.1 * time.deltaTime;
  });
}
