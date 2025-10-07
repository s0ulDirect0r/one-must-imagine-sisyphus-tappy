import "./main.css";
// import dominican from "../src/assets/fonts/dominican/DOMINICA.TTF";
import { Application, Text, TextStyle } from "pixi.js";
let scoreText: Text;
let streakText: Text;

export function initializeUIElements(app: Application) {
  // create UI elements
  // should these be initialized elsewhere?
  const textStyle = new TextStyle({ align: "center" });
  scoreText = new Text({ style: textStyle });
  streakText = new Text({ style: textStyle });

  streakText.pivot.set(streakText.width / 3, streakText.height);
  streakText.x = app.renderer.screen.width / 2.5;
  streakText.y = app.renderer.screen.height;

  scoreText.pivot.set(scoreText.width / 2, 0);
  scoreText.x = app.renderer.screen.width / 2.5;
  scoreText.y = 0;

  app.stage.addChild(scoreText);
  app.stage.addChild(streakText);

  return { scoreText, streakText };
}

export function renderUI(score: number, streak: number) {
  if (score) {
    scoreText.text = score;
  } else {
    scoreText.text = 500000;
  }
  if (streak) { 
    streakText.text = streak;
  } else {
    streakText.text = 500;
  }
}
