import { Application, Sprite, Texture, Rectangle, AnimatedSprite } from "pixi.js";
import * as PIXI from "pixi.js";

export async function initializePlayer(app: Application) {
    const texture = await PIXI.Assets.load("/assets/Sisyphus.png"); // load asset
    const baseTexture = texture.baseTexture;


    const framesPerRow = 6;
    const framesPerCol = 6;



    const frames: Texture[] = [];

    for (let i = 0; i < framesPerCol; i++) {
        for (let j = 0; j < framesPerRow; j++) {

            const frameRect = new Rectangle((2298 * j) / framesPerRow, (2136 * i) / framesPerCol, 383, 356);

            const frame = new Texture({
                source: baseTexture,
                frame: frameRect
            });

            frame.updateUvs();

            const sprite = new Sprite(frame);
            // app.stage.addChild(sprite)


            // Ensure it’s definitely visible
            sprite.anchor.set(0); // no offset
            sprite.x = 0;
            sprite.y = 0;

            // Optional: make it huge to be sure you see it
            sprite.scale.set(0.1); // adjust if needed
            frames.push(frame);
        }

    }

    // ---- Static sprite ----



    // ---- Animation ----
    const anim = new AnimatedSprite(frames);
    anim.anchor.set(0.5);
    anim.x = app.screen.width / 2;
    anim.y = app.screen.height / 2 - 200;
    anim.animationSpeed = 0.2;
    app.stage.addChild(anim)
    anim.play();







}