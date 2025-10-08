import { Application, Sprite, Texture, Rectangle, AnimatedSprite, Graphics } from "pixi.js";
import * as PIXI from "pixi.js";



export type Player = {
    x: number,
    y: number,
    sprite: AnimatedSprite
    speed: 0.1
}

let player: Player;
export async function initializePlayer(app: Application) {
    const texture = await PIXI.Assets.load("/assets/sissypose1.png"); // load asset
    const texture2 = await PIXI.Assets.load("/assets/sissypose2.png"); // load asset





    // ---- Animation ----
    const anime = new AnimatedSprite([texture2]);
    anime.anchor.set(0.5);

    player = { sprite: anime, x: app.screen.width / 2, y: app.screen.height / 2 + 300, speed: 0.1 }
    anime.x = player.x;
    anime.y = player.y;
    anime.animationSpeed = player.speed;
    app.stage.addChild(anime)
    anime.play();

    const circle = new Graphics();

    // Draw a red circle with a center at (100, 100) and a radius of 50
    circle.ellipse(player.x + 5, player.y - 15, 75, 60) // points = (x - h)^2/75^2 + (y-k) ^2/60^2 at (h, k)

    // Set the fill color to red (0xff0000)
    circle.stroke(0xff0000);

    // Add the circle to the stage
    app.stage.addChild(circle);

}

export function movePlayer(app: Application, direction: string) {
    if (direction === "up") {
        player.y += 20
    } else if (direction === "down") {
        player.y -= 20

    } else if (direction === "left") {
        player.x -= 20

    } else if (direction === "right") {
        player.x += 20

    }



}






