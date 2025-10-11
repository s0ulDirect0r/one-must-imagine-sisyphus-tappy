import { Text, TextStyle } from "pixi.js";

const MENU_TEXT_STYLE = new TextStyle({
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

const MENU_TEXT = () => new Text({ style: MENU_TEXT_STYLE });

let text: Text;

export function initFrame(width: number, height: number) {
  text = MENU_TEXT();

  // Anchor to center of text (0.5, 0.5 = middle)
  text.anchor.set(0.5, 0.5);

  // Position at screen center
  text.x = width / 2;
  text.y = height / 2;

  // Ensure it's on top
  text.zIndex = 1000;

  text.visible = false;
  text.text = "GAME OVER!!";

  return text;
}

export function frame() {
  console.log('frame set!')
  text.visible = true;
}
