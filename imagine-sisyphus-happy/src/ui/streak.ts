import { Application, Text, TextStyle, Graphics } from "pixi.js";

const UI_TEXT_STYLE = new TextStyle({
  align: "center",
});
const UI_TEXT = () => new Text({ style: UI_TEXT_STYLE });

let text: Text;

export function initFrame(width: number, height: number) {
  text = UI_TEXT();

  text.pivot.set(text.width / 3, text.height);
  text.x = width / 2.5;
  text.y = height;
  return text;
}

export function frame(streak: number) {
  text.text = `${streak}X`;
}
