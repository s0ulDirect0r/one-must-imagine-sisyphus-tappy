let lastBeat = 0;
let beatDurationMs: number;
let nextBeatPosition: number;
const window = 0.6;

export function setUpMetronome(bpm: number) {
    beatDurationMs = (60 / bpm); // 60/beatsperminuetn = seconds per beat --> * 1000 = miliseconds per beat
    nextBeatPosition = beatDurationMs;
}

// takes in current position of song and returns whether expecting user input or not
export function expectUserInput(musicPosition: number) {
    let activeBeatStartPosition = nextBeatPosition - window;
    let activeBeatEndPosition = nextBeatPosition + window;

    if (
        musicPosition >= activeBeatStartPosition &&
        musicPosition <= activeBeatEndPosition
    ) {
        lastBeat += 1;
        nextBeatPosition += beatDurationMs;
        return true;
    }

    return false;
}
