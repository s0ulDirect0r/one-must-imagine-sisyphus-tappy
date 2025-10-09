import { GameState } from "./stateMachine";

// The Metronome will be recording beat-time + 80 ms window. So, when Space arrives inside window → success, else miss.
// Returns {streak, elevation} delta; never touches full gameState.
export function judge(spacePressed, expectMove, currentElevation, currentStreak): Partial<GameState> {
  if (expectMove && spacePressed) {
    return { streak: currentStreak + 1, elevation: currentElevation + 100 };
  } else if (!expectMove && spacePressed || expectMove && !spacePressed) {
    return { streak: 0 };
  }
}
