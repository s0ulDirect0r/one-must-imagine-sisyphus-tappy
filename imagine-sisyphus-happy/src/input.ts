export type KeyState = { pressed: boolean; justPressed: boolean };
const keys: Map<string, KeyState> = new Map();

export function initialize() {
  console.log("am i initializing a lot?")
  window.addEventListener("keydown", (e) => {
    if (!keys.get(e.code)) {
      keys.set(e.code, { pressed: true, justPressed: true });
    }
  });

  window.addEventListener("keyup", (e) => {
    keys.delete(e.code);
  });
}

export const inputState = keys;

// TODO: ask myself the question? wtf am i actually trying to do on every game loop with these inputs?

// TODO: justPressed doesn't work
// TODO: turn this into a nice input system that detects mouse movement too
// export function updateInputs(): Map<string, KeyState> {
//   function update() {
//     // TODO: figure out if we want this to be the input system.
//     console.log("updating inputs")
//     keys.forEach((v, k) => {
//       v.justPressed = false;
//     });
//     requestAnimationFrame(update);
//   }

//   update();

//   return keys;
// }
