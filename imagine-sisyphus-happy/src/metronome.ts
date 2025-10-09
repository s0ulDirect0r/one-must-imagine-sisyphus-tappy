import { getCurrentAudioTime } from "./audio";

let lastBeat = 0;
let beatDuration: number;
let nextBeatPosition: number;
const WINDOW = 0.25

export function setUpMetronome(bpm: number) {
    beatDuration = (60 / bpm); // 60/beatsperminuetn = seconds per beat 
    nextBeatPosition = beatDuration;
}




export function isInBeatWindow(
    now: number,          // current audio time in seconds
    bpm: number,          // beats per minute of the song
    songStartTime: number, // when the song started (in same time base as now)
    // width of window in seconds (e.g. 0.15 = ±0.075s)
): boolean {
    const secondsPerBeat = 60 / bpm;
    const songTime = now - songStartTime; // elapsed time in song

    // Find the nearest beat time
    const beatIndex = Math.floor(songTime / secondsPerBeat);
    const beatTime = beatIndex * secondsPerBeat;

    // Return true if current time is within the symmetric window
    return Math.abs(songTime - beatTime) <= WINDOW / 2;
}

