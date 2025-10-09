import { GameState } from "./stateMachine";

// The Metronome will be recording beat-time + 80 ms window. So, when Space arrives inside window → success, else miss.
// Returns {streak, elevation} delta; never touches full gameState.
export function judge(spacePressed, expectMove, currentElevation, currentStreak): Partial<GameState> {
  if (!currentStreak) {
    currentStreak = 0;
  }

  if (!currentElevation) {
    currentElevation = 0;
  }

  if (expectMove && spacePressed) {
    console.log('move!')
    return { streak: currentStreak + 1, elevation: currentElevation + 100 };
  } else if (!expectMove && spacePressed || expectMove && !spacePressed) {
    console.log('punished!')
    return { streak: 0 };
  }
}
