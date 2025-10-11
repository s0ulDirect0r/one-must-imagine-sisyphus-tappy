import { AnimatedSprite, Point } from "pixi.js";
import * as PIXI from "pixi.js";
import { inputState } from "./input";
import { Player } from "./Player";

export type Enemy = {
  x: number;
  y: number;
  speed: number;
};

export let anime: AnimatedSprite;
const ANIMATION_SPEED = 0.1;

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

// player position, enemy position => { dx, dy }
export function calculateDirectionVector(player: Player, enemy: Enemy): { xVector: number; yVector: number, distanceToPlayer: number } {
  const dx = player.x - enemy.x;
  const dy = player.y - enemy.y;
  const distanceToPlayer = Math.sqrt((dx ** 2) + (dy ** 2));
  const xVector = dx / distanceToPlayer;
  const yVector = dy / distanceToPlayer;
  const vectors = { xVector, yVector, distanceToPlayer };
  return vectors;
}

export function moveEnemy(
  expectMove: boolean,
  enemy: Enemy,
  vectors: { xVector: number; yVector: number },
): Partial<Enemy> {
  if (expectMove ?? false) {
    return {
      x: (enemy.x += vectors.xVector * enemy.speed),
      y: (enemy.y += vectors.yVector * enemy.speed),
    };
  } else {
    return {
      x: enemy.x,
      y: enemy.y,
    };
  }
}

export function frame(enemy: Enemy) {
  anime.position.set(enemy.x, enemy.y);
}

