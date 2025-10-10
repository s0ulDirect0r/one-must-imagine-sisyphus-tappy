import {
  Application,
  Assets,
  ColorMatrixFilter,
  Text,
  FillGradient,
  TextStyle,
  Graphics,
  Ticker,
  Color,
} from "pixi.js";

const fill = new FillGradient(0, 0, 0, 10);

const colors = [0xffffff, 0x00ff99].map((color) =>
  Color.shared.setValue(color).toNumber(),
);

colors.forEach((number, index) => {
  const ratio = index / colors.length;
  fill.addColorStop(ratio, number);
});

const filter = new ColorMatrixFilter();

const UI_TEXT_STYLE = new TextStyle({
  fontFamily: "Dominican",
  fontSize: 60,
  fontWeight: "bold",
  align: "center",
  fill: { fill }, // Gradient: magenta -> cyan -> yellow
  // fill: ["#ff00ff", "#00ffff", "#ffff00"], // Gradient: magenta -> cyan -> yellow
  stroke: 0x000000,
  filters: [filter],
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

const UI_TEXT = () => new Text({ style: UI_TEXT_STYLE });

let text: Text;

export function initFrame(width: number, height: number) {
  text = UI_TEXT();

  text.pivot.set(text.width / 2, 0);
  text.x = width / 2.5;
  text.y = 100;

  return text;
}

let counter = 0;

export function frame(elevation: number, ticker: Ticker) {
  text.text = `${elevation} ft`;
  counter += ticker.deltaMS * 1000;

  filter.hue(Math.sin(counter) * 360, false);
}
