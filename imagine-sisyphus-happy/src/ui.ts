import { DEBUG_MODE } from "./debug";
import { inputState } from "./input";
import "./main.css";
import { Application, Container, Text, TextStyle, Graphics } from "pixi.js";
import { getCurrentAudioTime } from "./audio";

import * as elevation from "./ui/elevation";
import * as streak from "./ui/streak";
import * as gameover from "./ui/gameover";
import * as debug from "./ui/debug";
import * as debugMetronome from "./ui/debugMetronome";

let debugText: Text;
let debugMetronomeText: Text;
let uiElements: Container;

export function initFrame(app: Application) {
  uiElements = new Container();
  const width = app.screen.width;
  const height = app.screen.height;

  const elevationText = elevation.initFrame(width, height);
  uiElements.addChild(elevationText);

  const streakText = streak.initFrame(width, height);
  uiElements.addChild(streakText);

  const gameOverText = gameover.initFrame(width, height);
  uiElements.addChild(gameOverText);

  // Make sure z-index sorting is enabled on the stage
  uiElements.sortableChildren = true;

  if (DEBUG_MODE) {
    const debugText = debug.initFrame(width, height);
    uiElements.addChild(debugText);

    const debugMetronomeText = debugMetronome.initFrame(width, height);
    uiElements.addChild(debugMetronomeText);
  }

  return uiElements;
}

export function frame(
  expectMove: boolean,
  elevationScore: number,
  streakScore: number,
  lost: boolean,
  ticker?: Ticker,
) {
  elevation.frame(elevationScore, ticker);
  streak.frame(streakScore);

  if (lost) {
    gameover.frame();
  }
}
