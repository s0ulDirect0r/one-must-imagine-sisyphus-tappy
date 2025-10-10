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
  fontSize: 40,
  fontWeight: "bold",
  align: "center",
  fill: { fill }, // Gradient: magenta -> cyan -> yellow
  // fill: ["#ff00ff", "#00ffff", "#ffff00"], // Gradient: magenta -> cyan -> yellow
  stroke: { color: 0x000000, width: 6 },
  filters: [filter],
  dropShadow: {
    alpha: 0.5,
    color: "#000000",
    blur: 10,
    angle: Math.PI / 4,
    distance: 8,
  },
  wordWrap: true,
  wordWrapWidth: 300,
  letterSpacing: 2,
});

const UI_TEXT = () => new Text({ style: UI_TEXT_STYLE });

let text: Text;

export function initFrame(width: number, height: number) {
  text = UI_TEXT();

  text.pivot.set(300, 50);
  text.position.set(width, height - 20);
  return text;
}

let counter = 0;

export function frame(streak: number, ticker: Ticker) {
  const streakString = "🔥".repeat(streak + 1);
  // text.text = streakString ? streakString.concat("combo!") : "😔";
  text.text = streakString;

  counter += ticker.deltaMS * 1000;
  filter.hue(Math.cos(counter) * 360, false);
}
