import { Text, TextStyle } from "pixi.js";

const UI_TEXT_STYLE = new TextStyle({
  align: "center",
});
const UI_TEXT = () => new Text({ style: UI_TEXT_STYLE });

let text: Text;

export function initFrame(width: number) {
  text = UI_TEXT();

  text.pivot.set(text.width / 2, 0);
  text.x = width / 8;
  text.y = 200;

  return text;
}

export function frame() {}
