import { DEBUG_MODE } from "./debug";
import { inputState } from "./input";
import "./main.css";
import { Application, Text, TextStyle, Graphics } from "pixi.js";
import { getCurrentAudioTime } from "./audio";
let elevationText: Text;
let streakText: Text;
let gameOverText: Text;
let debugText: Text;
let debugMetronomeText: Text;

export function initializeUIElements(app: Application) {
  // create UI elements
  // should these be initialized elsewhere?
  const textStyle = new TextStyle({
    align: "center",
  });

  const gameOverTextStyle = new TextStyle({
    fontFamily: "Arial Black, Arial, sans-serif",
    fontSize: 72,
    fontWeight: "bold",
    fill: ["#ff00ff", "#00ffff", "#ffff00"], // Gradient: magenta -> cyan -> yellow
    stroke: "#ffffff",
    strokeThickness: 6,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 10,
    dropShadowAngle: Math.PI / 4,
    dropShadowDistance: 8,
    wordWrap: true,
    wordWrapWidth: 440,
    letterSpacing: 2,
  });
  elevationText = new Text({ style: textStyle });
  streakText = new Text({ style: textStyle });
  gameOverText = new Text({ style: gameOverTextStyle });

  streakText.pivot.set(streakText.width / 3, streakText.height);
  streakText.x = app.renderer.screen.width / 2.5;
  streakText.y = app.renderer.screen.height;

  elevationText.pivot.set(elevationText.width / 2, 0);
  elevationText.x = app.renderer.screen.width / 2.5;
  elevationText.y = 0;

  // Anchor to center of text (0.5, 0.5 = middle)
  gameOverText.anchor.set(0.5, 0.5);

  // Position at screen center
  gameOverText.x = app.screen.width / 2;
  gameOverText.y = app.screen.height / 2;

  // Make sure it's on top
  gameOverText.zIndex = 1000;

  // Add to stage

  // Make sure z-index sorting is enabled on the stage
  app.stage.sortableChildren = true;

  app.stage.addChild(elevationText);
  app.stage.addChild(streakText);
  app.stage.addChild(gameOverText);

  if (DEBUG_MODE) {
    debugText = new Text({ style: textStyle });
    debugMetronomeText = new Text({ style: textStyle });

    debugText.pivot.set(debugText.width / 2, 0);
    debugText.x = app.renderer.screen.width / 6;
    debugText.y = 100;
    app.stage.addChild(debugText);

    debugMetronomeText.pivot.set(debugMetronomeText.width / 2, 0);
    debugMetronomeText.x = app.renderer.screen.width / 8;
    debugMetronomeText.y = 200;
    app.stage.addChild(debugMetronomeText);
  }

  return { elevationText, streakText };
}

let lastBeatTime = 0;
let flashing = false;

export function renderUI(
  expectMove: boolean,
  elevation: number,
  streak: number,
  lost: boolean,
) {
  elevationText.text = `${elevation} ft`;
  streakText.text = `${streak}x`;

  if (lost) {
    gameOverText.text = "GAME OVER!!";
  }
}

/*

if (DEBUG_MODE) {
  const entries = inputState.entries();
  let textGuy = "Key Debug State: \n";
  for (const [key, value] of entries) {
    textGuy = textGuy.concat(
      key,
      ":    ",
      String(value.pressed),
      "     ",
      String(value.justPressed),
      "\n",
    );
  }
  debugText.text = textGuy;
  debugMetronomeText.text = `Metronome Debug State: \n${expectMove}`;
}

*/
