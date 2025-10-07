import "./main.css";
import { Application, Text, TextStyle } from "pixi.js";
let elevationText: Text;
let streakText: Text;

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

  return { elevationText, streakText };
}

export function renderUI(elevation: number, streak: number) {
  if (elevation) {
    elevationText.text = `${elevation} ft`;
  } else {
    elevationText.text = `${500000} ft`;
  }

  if (streak) { 
    streakText.text = `${streak}x`;
  } else {
    streakText.text = `${500}x`;
  }
}
