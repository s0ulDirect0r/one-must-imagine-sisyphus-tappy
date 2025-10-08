import { DEBUG_MODE } from "./debug";
import { inputState } from "./input";
import "./main.css";
import { Application, Text, TextStyle } from "pixi.js";
let elevationText: Text;
let streakText: Text;
let debugText: Text;
let debugMetronomeText: Text;

export function initializeUIElements(app: Application) {
  // create UI elements
  // should these be initialized elsewhere?
  const textStyle = new TextStyle({
    align: "center",
  });
  elevationText = new Text({ style: textStyle });
  streakText = new Text({ style: textStyle });

  streakText.pivot.set(streakText.width / 3, streakText.height);
  streakText.x = app.renderer.screen.width / 2.5;
  streakText.y = app.renderer.screen.height;

  elevationText.pivot.set(elevationText.width / 2, 0);
  elevationText.x = app.renderer.screen.width / 2.5;
  elevationText.y = 0;

  app.stage.addChild(elevationText);
  app.stage.addChild(streakText);

  if (DEBUG_MODE) {
    debugText = new Text({ style: textStyle });
<<<<<<< Updated upstream
    debugMetronomeText = new Text({ style: textStyle })
=======
    debugMetronomeText = new Text({ style: textStyle });
>>>>>>> Stashed changes

    debugText.pivot.set(debugText.width / 2, 0);
    debugText.x = app.renderer.screen.width / 6;
    debugText.y = 100;
<<<<<<< Updated upstream
    app.stage.addChild(debugText)
=======
    app.stage.addChild(debugText);
>>>>>>> Stashed changes

    debugMetronomeText.pivot.set(debugMetronomeText.width / 2, 0);
    debugMetronomeText.x = app.renderer.screen.width / 8;
    debugMetronomeText.y = 200;
    app.stage.addChild(debugMetronomeText);
  }

  return { elevationText, streakText };
}

export function renderUI(
  expectMove: boolean,
  elevation: number,
  streak: number,
) {
  elevationText.text = `${elevation} ft`;
  streakText.text = `${streak}x`;

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
}
