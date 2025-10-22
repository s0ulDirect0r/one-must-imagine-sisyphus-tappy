import { DEBUG_MODE } from "./debug";
import "./main.css";
import { Application, Container, Ticker } from "pixi.js";

import * as elevation from "./ui/elevation";
import * as streak from "./ui/streak";
import * as gameover from "./ui/gameover";
import * as debug from "./ui/debug";
import * as debugMetronome from "./ui/debugMetronome";

let uiElements: Container;

export function initFrame(app: Application) {
  uiElements = new Container();
  const width = app.screen.width;
  const height = app.screen.height;

  const elevationText = elevation.initFrame();
  uiElements.addChild(elevationText);

  const streakText = streak.initFrame(width, height);
  uiElements.addChild(streakText);

  const gameOverText = gameover.initFrame(width, height);
  uiElements.addChild(gameOverText);

  // Make sure z-index sorting is enabled on the stage
  uiElements.sortableChildren = true;

  if (DEBUG_MODE) {
    const debugText = debug.initFrame(width);
    uiElements.addChild(debugText);

    const debugMetronomeText = debugMetronome.initFrame(width);
    uiElements.addChild(debugMetronomeText);
  }

  return uiElements;
}

export function frame(
  _expectMove: boolean,
  elevationScore: number,
  streakScore: number,
  lost: boolean,
  ticker?: Ticker,
) {
  if (ticker) {
    elevation.frame(elevationScore, ticker);
    streak.frame(streakScore, ticker);
  }

  if (lost) {
    gameover.frame();
  }
}
