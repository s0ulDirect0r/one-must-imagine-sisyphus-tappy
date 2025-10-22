import { Application, Graphics } from "pixi.js";
import { getCurrentAudioTime } from "./audio";
import type { GameState } from "./stateMachine";

const backgroundScreen = new Graphics();
const VISUAL_OFFSET = 0; // Adjust if you want visuals slightly ahead
const PULSE_START = 0.5; // How much of the beat to start fading in (50%)
const FLASH_DECAY = 0.2; // Fraction of beat for quick flash at the beat

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
  });
  return backgroundScreen;
}

export function changeBackgroundColor(color: number, app: Application) {
  backgroundScreen.clear();
  backgroundScreen.fill({ color: color, alpha: 0.5 });
  backgroundScreen.rect(0, 0, app.screen.width, app.screen.height);
  backgroundScreen.fill();
}

export function frame(gameState: GameState, app: Application) {
  if (gameState.songStartTime === undefined) return;

  const now = getCurrentAudioTime() + VISUAL_OFFSET;
  const elapsed = now - gameState.songStartTime;
  const secondsPerBeat = 60 / gameState.songBpm;

  const beatPhase = (elapsed % secondsPerBeat) / secondsPerBeat; // 0 → 1

  // Intensity ramps up before the beat
  let intensity = 0;
  if (beatPhase >= PULSE_START) {
    intensity = (beatPhase - PULSE_START) / (1 - PULSE_START); // 0→1
  }

  // Quick flash at the actual beat
  if (beatPhase < FLASH_DECAY) {
    intensity = 1 - beatPhase / FLASH_DECAY;
  }

  // Convert intensity to color
  const baseColor = 0xfffafa; // background
  const flashColor = 0xcc33ff; // beat flash
  const color = lerpColor(baseColor, flashColor, intensity);
  changeBackgroundColor(color, app);
}

function lerpColor(a: number, b: number, t: number) {
  t = Math.min(Math.max(t, 0), 1); // clamp between 0–1
  const ar = (a >> 16) & 0xff;
  const ag = (a >> 8) & 0xff;
  const ab = a & 0xff;
  const br = (b >> 16) & 0xff;
  const bg = (b >> 8) & 0xff;
  const bb = b & 0xff;

  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);

  return (rr << 16) | (rg << 8) | rb;
}
