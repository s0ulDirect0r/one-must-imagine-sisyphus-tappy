import { AnimatedSprite } from "pixi.js";
import * as PIXI from "pixi.js";
import { inputState } from "./input";

export type Enemy = {
  x: number;
  y: number;
};

let anime: AnimatedSprite;
const ANIMATION_SPEED = 0.1;

const ENEMY_SPEED = 10;

export async function initFrame(
  width: number,
  height: number,
  enemy: Enemy,
): Promise<AnimatedSprite> {
  // const texture = await PIXI.Assets.load("/assets/partyfury.png"); // load asset
  const texture2 = await PIXI.Assets.load("/assets/partyfury.png"); // load asset
  anime = new AnimatedSprite([texture2]);
  anime.x = enemy.x;
  anime.y = enemy.y;
  anime.play();

  anime.animationSpeed = ANIMATION_SPEED;

  anime.scale.set(anime.scale.x * 0.5);

  return anime;
}

export function moveEnemy(enemy: Enemy): Partial<Enemy> {
  return { y: enemy.y - ENEMY_SPEED };
}

export function shiftEnemy(enemy: Enemy): Partial<Enemy> {
  if (inputState.get("ArrowLeft")?.justPressed) {
    return { x: enemy.x - 50 };
  } else if (inputState.get("ArrowRight")?.justPressed) {
    return { x: enemy.x + 50 };
  }
  return enemy;
}

export function frame(enemy: Enemy) {
  anime.position.set(enemy.x, enemy.y);
}
