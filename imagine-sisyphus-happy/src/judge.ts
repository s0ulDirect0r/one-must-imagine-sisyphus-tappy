import { GameState } from "./stateMachine";

// The Metronome will be recording beat-time + 80 ms window. So, when Space arrives inside window → success, else miss.
// Returns {streak, elevation} delta; never touches full gameState.
export function judge(
  spacePressed: boolean,
  expectMove: boolean,
  currentElevation: number,
  currentStreak: number,
  currentMissStreak: number,
): Partial<GameState> {
  if (expectMove && spacePressed) {
    return {
      streak: currentStreak + 1,
      elevation: currentElevation + 100,
      missStreak: 0,
    };
  } else if ((!expectMove && spacePressed) || (expectMove && !spacePressed)) {
    const newMissStreak = currentMissStreak + 1;
    // LOSS CONDITION HERE
    if (newMissStreak >= 20) {
      return { lost: true };
    }
    return { streak: 0, missStreak: newMissStreak };
  }
  return {};
}
