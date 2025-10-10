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
import * as obstacle from "./obstacle";
import * as player from "./Player";
import * as enemy from "./enemy";
import * as screen from "./backgroundScreen";
import { DEBUG_MODE } from "./debug";

let app: Application;
let lastState: GameState;
let colorMatrix: ColorMatrixFilter;

/*
 * Assets can be added here, and `Asses.load` can be called either here
 * or in the "child" elements that use it like ui/elevation.ts in order
 * for it to access the Dominican font.
 *
 * DOES WORK:
 * Add here | Load here | use "dominican" font in ui/elevation.ts
 *
 * DOES NOT WORK:
 * Add here | load in ui.ts | use "dominican" font in ui/elevation.ts
 */
Assets.add({
  alias: "Dominican",
  src: "assets/fonts/dominican/DOMINICA.TTF",
  data: {
    family: "Dominican",
    weights: ["Regular"],
  },
});

// Initialize the application
export async function initialize(gameState: GameState) {
  // Create a new application
  app = new Application();
  initDevtools({ app });

  await app.init({
    background: "#1099bb",
    resizeTo: window,
  });
  const { width, height } = app.screen;

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const bg = await background.initFrame(width, height);
  app.stage.addChild(bg);

  // TODO
  const bgScreen = screen.initFrame(app);
  app.stage.addChild(bgScreen);

  const obs = await obstacle.initFrame(gameState.obstacles);
  // app.stage.addChild(obs);

  const playerSprite = await player.initFrame(width, height, gameState.player);
  app.stage.addChild(playerSprite);

  const enemySprite = await enemy.initFrame(width, height, gameState.enemy);
  app.stage.addChild(enemySprite);

  const uiElements = ui.initFrame(app);
  app.stage.addChild(uiElements);

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
  background.frame(state, ticker);
  console.log("TIME: ", state.songStartTime)
  screen.frame(state, app);
  obstacle.frame(app, state.obstacles);
  player.frame(state.player);
  enemy.frame(state.enemy);
  ui.frame(state.expectMove, state.elevation, state.streak, state.lost, ticker);
}
