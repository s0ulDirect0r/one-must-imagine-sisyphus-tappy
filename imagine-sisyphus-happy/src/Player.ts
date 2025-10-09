import { Application, Sprite, Texture, Rectangle, AnimatedSprite, Graphics } from "pixi.js";
import * as PIXI from "pixi.js";
import { inputState } from "./input";

export type Player = {
  x: number;
  y: number;
  speed: number;
};

let anime: AnimatedSprite;
export async function initializePlayer(app: Application, player: Player) {
  const texture = await PIXI.Assets.load("/assets/sissypose1.png"); // load asset
  const texture2 = await PIXI.Assets.load("/assets/sissypose2.png"); // load asset

  // ---- Animation ----
  anime = new AnimatedSprite([texture2]);
  anime.anchor.set(0.5);

  anime.x = player.x;
  anime.y = player.y;
  anime.animationSpeed = player.speed;
  app.stage.addChild(anime);
  anime.play();

  const circle = new Graphics();

  // Draw a red circle with a center at (100, 100) and a radius of 50
  circle.ellipse(player.x + 5, player.y - 15, 75, 60); // points = (x - h)^2/75^2 + (y-k) ^2/60^2 at (h, k)

  // Set the fill color to red (0xff0000)
  circle.stroke(0xff0000);

  // Add the circle to the stage
  app.stage.addChild(circle);
}

export function movePlayer(player: Player): Player {
  anime.x = player.x;
  anime.y = player.y - 20;

  return { ...player, x: anime.x, y: anime.y };
}

export function shiftPlayer(player: Player): Player {
  if (inputState.get("ArrowLeft")?.justPressed) {
    anime.x = player.x - 50;
    anime.y = player.y;
  } else if (inputState.get("ArrowRight")?.justPressed) {
    anime.x = player.x + 50;
    anime.y = player.y;
  }

  return { ...player, x: anime.x, y: anime.y };
}
