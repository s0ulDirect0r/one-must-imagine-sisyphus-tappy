import { Application, Sprite, Texture, Rectangle, AnimatedSprite, Graphics } from "pixi.js";
import * as PIXI from "pixi.js";
import { GameState } from "./stateMachine";


export type Player = {
    x: number;
    y: number;
};

const ANIMATION_SPEED = 0.1

const PLAYER_SPEED = 20


let anime: AnimatedSprite;
export async function initFrame(width: number, height: number, player: Player): Promise<AnimatedSprite> {
  const texture = await PIXI.Assets.load("/assets/sissypose1.png"); // load asset
  const texture2 = await PIXI.Assets.load("/assets/sissypose2.png"); // load asset
  anime = new AnimatedSprite([texture2]);
  anime.x = player.x;
  anime.y = player.y;
  anime.play()

  anime.animationSpeed = ANIMATION_SPEED

  return anime
}

export function movePlayer(player: Player): Player {
  return { ...player, x: anime.x, y: anime.y - PLAYER_SPEED };
}

export function frame(player: Player){
  anime.position.set(player.x, player.y)
  // anime.x = player.x
  // anime.y = player.y
}





