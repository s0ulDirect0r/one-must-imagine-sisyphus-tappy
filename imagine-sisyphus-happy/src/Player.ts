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
import { CAMERA_EFFECT } from "./stateMachine";

export type Player = {
  x: number;
  y: number;
};

export let anime: AnimatedSprite;
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

export function movePlayer(
  player: Player,
  successfulMovement: boolean,
): Partial<Player> {
  if (successfulMovement) {
    return { y: player.y - PLAYER_SPEED };
  } else {
    return { y: player.y + CAMERA_EFFECT / 2 };
  }
}

export function shiftPlayer(player: Player): Partial<Player> {
  if (inputState.get("ArrowLeft")?.justPressed) {
    return { x: player.x - 50 };
  } else if (inputState.get("ArrowRight")?.justPressed) {
    return { x: player.x + 50 };
  }
  return { x: player.x };
}

export function frame(player: Player) {
  anime.position.set(player.x, player.y);
}
