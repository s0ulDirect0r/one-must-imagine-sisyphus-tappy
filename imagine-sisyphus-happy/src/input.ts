export type KeyState = { pressed: boolean; justPressed: boolean };
const keys: Map<string, KeyState> = new Map();

export function initialize() {
  window.addEventListener("keydown", (e) => {
    if (!keys.get(e.code)) {
      keys.set(e.code, { pressed: true, justPressed: true });
      console.log(keys.get(e.code))
    }
  });

  window.addEventListener("keyup", (e) => {
    keys.delete(e.code);
  });
}

// TODO: justPressed doesn't work
// TODO: turn this into a nice input system that detects mouse movement too
export function updateInputs(): Map<string, KeyState> {
  function update() {
    keys.forEach((v, k) => {
      v.justPressed = false;
    });
    requestAnimationFrame(update);
  }

  update();

  return keys;
}
