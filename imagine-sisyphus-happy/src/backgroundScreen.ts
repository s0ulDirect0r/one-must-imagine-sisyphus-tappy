import { Application, Graphics } from "pixi.js";
import { getCurrentAudioTime } from "./audio";

const backgroundScreen = new Graphics();
const FLASH_DURATION = 0.6;
let lastBeatTime = 0;
let flashing = false;

// Set the fill style with a color and alpha
// 0x000000 is black, and 0.5 sets 50% opacity

export function initializeBackgroundScreen(app: Application) {
    backgroundScreen.rect(0, 0, app.screen.width, app.screen.height);
    backgroundScreen.fill({ color: "#cc33ff", alpha: 0.5 });
    // Draw a giant rectangle that covers the full screen

    // Handle window resizing to keep the square full-screen
    window.addEventListener("resize", () => {
        backgroundScreen.rect(0, 0, app.screen.width, app.screen.height);
    });

    return backgroundScreen;
}

export function changeBackgroundColor(color: string, app: Application) {
    backgroundScreen.clear();
    backgroundScreen.fill({ color: color, alpha: 0.5 });
    backgroundScreen.rect(0, 0, app.screen.width, app.screen.height);
    backgroundScreen.fill();
}

export function renderBackgroundScreen(expectMove: boolean, app: Application) {
    const now = getCurrentAudioTime() + .07;

    // Trigger flash only when expectMove just started
    if (expectMove) {
        // If we're within beat window, keep flashing active
        if (!flashing) {
            flashing = true;
            lastBeatTime = now;
            changeBackgroundColor("#cc33ff", app);
        }
    } else if (flashing && now - lastBeatTime > FLASH_DURATION) {
        flashing = false;
        changeBackgroundColor("#33ff85", app);
    }


}