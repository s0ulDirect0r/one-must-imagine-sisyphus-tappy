import { GameState } from "./stateMachine";
import { Application, Text } from "pixi.js";

export function renderUI(app: Application, score: number, streak: number) {
  // TODO: show score at top-right of screen
  const scoreText = new Text({ text: "10000000" });
  const streakText = new Text({ text: "1000x" });
  scoreText.x = 100;
  scoreText.y = 200;

  app.stage.addChild(scoreText);
  app.stage.addChild(streakText);
}
