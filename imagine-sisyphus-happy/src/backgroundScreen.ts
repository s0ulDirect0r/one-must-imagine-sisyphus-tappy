import { Application, Graphics } from "pixi.js"
import { getCurrentAudioTime } from "./audio";


const backgroundScreen = new Graphics();

// Set the fill style with a color and alpha
// 0x000000 is black, and 0.5 sets 50% opacity

export function initializeBackgroundScreen(app: Application) {
    backgroundScreen.fill({ color: "#cc33ff", alpha: 0.5 });
    backgroundScreen.rect(0, 0, app.screen.width, app.screen.height);
    backgroundScreen.fill();

    // Draw a giant rectangle that covers the full screen

    // Add the square to the stage so it can be seen
    app.stage.addChild(backgroundScreen);

    // Handle window resizing to keep the square full-screen
    window.addEventListener('resize', () => {
        backgroundScreen.rect(0, 0, app.screen.width, app.screen.height);
    });

}


export function changeBackgroundColor(color: string, app: Application) {



    backgroundScreen.clear();
    backgroundScreen.fill({ color: color, alpha: 0.5 });
    backgroundScreen.rect(0, 0, app.screen.width, app.screen.height);
    backgroundScreen.fill();

}

export function renderBackgroundScreen(expectMove: boolean, app: Application) {

    let lastBeatTime = 0;
    let flashing = false;
    const now = getCurrentAudioTime();
    const flashDuration = 0.6; // seconds — try tweaking this

    // Trigger flash only when expectMove just started
    if (expectMove && !flashing) {
        flashing = true;
        lastBeatTime = now;
        changeBackgroundColor("#cc33ff", app);
        return "red"
    }

    // After flash duration, fade back
    if (flashing && now - lastBeatTime > flashDuration) {
        flashing = false;
        changeBackgroundColor("#33ff85", app);
        return "green"
    }
}