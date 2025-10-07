import "./main.css";
// import dominican from "../src/assets/fonts/dominican/DOMINICA.TTF";
import { Application, Color, FillGradient, Text, TextStyle } from "pixi.js";

export function renderUI(scoreText: Text, streakText: Text, score: number, streak: number) {
  scoreText.text = score;
  streakText.text = streak;
}
