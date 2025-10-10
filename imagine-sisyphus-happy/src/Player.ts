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

type Point = {
  x: number;
  y: number;
};

const OFFSET_X = 5;
const OFFSET_Y = -15;
const RADIUS_X = 75;
const RADIUS_Y = 60;
const RADIUS = 60;

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function withinCircle(player: Player, vertex: Point) {
  return distance(player.x, player.y, vertex.x, vertex.y) <= RADIUS;
}

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

export function movePlayer(player: Player): Partial<Player> {
  return { y: player.y - PLAYER_SPEED };
}

export function shiftPlayer(player: Player): Partial<Player> {
  if (inputState.get("ArrowLeft")?.justPressed) {
    return { x: player.x - 50 };
  } else if (inputState.get("ArrowRight")?.justPressed) {
    return { x: player.x + 50 };
  }
  return player;
}

export function frame(player: Player) {
  anime.position.set(player.x, player.y);
}
