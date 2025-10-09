import { Application, Graphics } from "pixi.js";
import { getCurrentAudioTime } from "./audio";

const backgroundScreen = new Graphics();
const FLASH_DURATION = 0.6;
const VISUAL_OFFSET = 0.07;

let lastBeatTime = 0;
let flashing = false;

// Set the fill style with a color and alpha
// 0x000000 is black, and 0.5 sets 50% opacity

export function initFrame(app: Application) {
  backgroundScreen.rect(0, 0, app.screen.width, app.screen.height);
  backgroundScreen.fill({ color: "#cc33ff", alpha: 0.5 });
  // Draw a giant rectangle that covers the full screen

  // Handle window resizing to keep the square full-screen
  window.addEventListener("resize", () => {
    backgroundScreen.rect(0, 0, app.screen.width, app.screen.height);
    backgroundScreen.fill({ color: "#cc33ff", alpha: 0.5 });
    // Draw a giant rectangle that covers the full screen

    // Handle window resizing to keep the square full-screen
    window.addEventListener("resize", () => {
      backgroundScreen.rect(0, 0, app.screen.width, app.screen.height);
    });
  });
  return backgroundScreen;
}

export function changeBackgroundColor(color: number, app: Application) {
  backgroundScreen.clear();
  backgroundScreen.fill({ color: color, alpha: 0.5 });
  backgroundScreen.rect(0, 0, app.screen.width, app.screen.height);
  backgroundScreen.fill();
}

export function frame(expectMove: boolean, app: Application) {
  const now = getCurrentAudioTime() + VISUAL_OFFSET;

  // Start flash when expectMove becomes true
  if (expectMove && !flashing) {
    flashing = true;
    lastBeatTime = now;
  }

  // Determine current flash color
  let color = "#33ff85"; // default
  if (flashing) {
    color = "#cc33ff";
  }

  // Draw the background every frame
  changeBackgroundColor(color, app);

  // End flash after FLASH_DURATION
  if (flashing && now - lastBeatTime >= FLASH_DURATION) {
    flashing = false;
  }
}
