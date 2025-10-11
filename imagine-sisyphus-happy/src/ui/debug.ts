import { Application, Text, TextStyle, Graphics } from "pixi.js";

const UI_TEXT_STYLE = new TextStyle({
  align: "center",
});
const UI_TEXT = () => new Text({ style: UI_TEXT_STYLE });

let text: Text;

export function initFrame(width: number, height: number) {
  text = UI_TEXT();

  text.pivot.set(text.width / 2, 0);
  text.x = width / 6;
  text.y = 100;

  return text;
}

export function frame() {}
