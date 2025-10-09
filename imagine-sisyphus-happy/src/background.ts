import { Assets, Ticker, Container } from "pixi.js";
import { CompositeTilemap } from "@pixi/tilemap";

let tiles: CompositeTilemap;
let gridDeltaY = 0;
let gridDeltaX = 0;
const gridDeltaCap = 64;
const TILE_LENGTH = 64;
const FPS = 60;
const SCROLL_RATE = TILE_LENGTH / FPS; // One Tile per Second
// TODO Add FLIP_RATE

// Delta time is 60 units per second.

export async function init(width: number, height: number) {
  // console.log("tinyswords", JSON.stringify(tinyswords));
  // console.log("groundjson", JSON.parse("/assets/ground.json"))

  // Assets.add({ alias: "atlas", src: ground });
  Assets.add({ alias: "atlas", src: "/assets/tinyswords.json" });
  const atlasTexture = await Assets.load("atlas");
  tiles = new CompositeTilemap();

  for (
    let x = -2 * TILE_LENGTH;
    x <= width + 2 * TILE_LENGTH;
    x += TILE_LENGTH
  ) {
    for (
      let y = -2 * TILE_LENGTH;
      y <= height + 2 * TILE_LENGTH;
      y += TILE_LENGTH
    ) {
      const myTexture = ((x + y) / TILE_LENGTH) % 2 == 0 ? "A_C" : "C_C";
      tiles.tile(myTexture, x, y);
    }
  }

  return tiles;
}

let polarity = -1;

export async function frame(ticker) {
  if (gridDeltaY > 2 * gridDeltaCap) {
    gridDeltaY = 0;
    polarity = -polarity;

    if (gridDeltaX == 0) {
      gridDeltaX = -TILE_LENGTH;
    } else {
      gridDeltaX = 0;
    }
  }

  gridDeltaY += ((TILE_LENGTH / 1000) * ticker.deltaMS) % gridDeltaCap;
  gridDeltaX +=
    (polarity * ((TILE_LENGTH / 1000) * ticker.deltaMS)) % gridDeltaCap;

  // gridDeltaX = 0;
  tiles.y = gridDeltaY;
  tiles.x = gridDeltaX;
}
