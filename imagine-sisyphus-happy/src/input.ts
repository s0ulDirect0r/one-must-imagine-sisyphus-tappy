export type KeyState = { pressed: boolean; justPressed: boolean };
const keys: Map<string, KeyState> = new Map();

export function initialize() {
  window.addEventListener("keydown", (e) => {
    if (!keys.get(e.code)) {
      keys.set(e.code, { pressed: true, justPressed: true });
    }
  });

  window.addEventListener("keyup", (e) => {
    keys.delete(e.code);
  });
}

// TODO: ask myself the question? wtf am i actually trying to do on every game loop with these inputs?

// TODO: justPressed doesn't work
// TODO: turn this into a nice input system that detects mouse movement too
export function updateInputs(): void {
  keys.forEach((v) => {
    v.justPressed = false;
  });
}

export const inputState = keys;
