import {
  Application,
  Sprite,
  Texture,
  Rectangle,
  AnimatedSprite,
  Graphics,
} from "pixi.js";
import * as PIXI from "pixi.js";
import { inputState } from "./input";

export type Player = {
  x: number;
  y: number;
};

let anime: AnimatedSprite;
const ANIMATION_SPEED = 0.1;

const PLAYER_SPEED = 20;

export async function initFrame(
  width: number,
  height: number,
  player: Player,
): Promise<AnimatedSprite> {
  const texture = await PIXI.Assets.load("/assets/sissypose1.png"); // load asset
  const texture2 = await PIXI.Assets.load("/assets/sissypose2.png"); // load asset
  anime = new AnimatedSprite([texture2]);
  anime.x = player.x;
  anime.y = player.y;
  anime.play();

  anime.animationSpeed = ANIMATION_SPEED;

  return anime;
}

export function movePlayer(player: Player): Player {
  return { ...player, x: player.x, y: player.y - PLAYER_SPEED };
}

export function shiftPlayer(player: Player): Player {
  if (inputState.get("ArrowLeft")?.justPressed) {
    return { ...player, x: player.x - 50, y: player.y };
  } else if (inputState.get("ArrowRight")?.justPressed) {
    return { ...player, x: player.x + 50, y: player.y };
  }
  return player;
}

export function frame(player: Player) {
  anime.position.set(player.x, player.y);
}
