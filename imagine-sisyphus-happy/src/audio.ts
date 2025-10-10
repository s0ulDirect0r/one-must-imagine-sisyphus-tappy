let audioCtx: AudioContext;
let buffer: AudioBuffer;
let source: AudioBufferSourceNode | null = null;
let startTime = 0; // AudioContext.currentTime when playback starts
let bpm = 136; // hardcoded for now
let songDuration = 0;

export async function loadAudio(url: string = "/assets/garbage.mp3") {
    if (!audioCtx) audioCtx = new AudioContext();

    // Fetch and decode audio
    const arrayBuffer = await fetch(url).then((r) => r.arrayBuffer());
    buffer = await audioCtx.decodeAudioData(arrayBuffer);
    songDuration = buffer.duration;

    return {
        bpm,
        songDuration,
    };
}

export function playAudio(offset: number = 0) {
    if (!audioCtx || !buffer) throw new Error("Audio not loaded");

    // Stop any previous source
    if (source) source.stop();

    source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);

    startTime = audioCtx.currentTime - offset; // startTime adjusted for offset
    source.start(audioCtx.currentTime, offset);
}

export function getCurrentAudioTime() {
    if (!audioCtx || !source) return 0;
    return audioCtx.currentTime - startTime; // seconds, precise
}
