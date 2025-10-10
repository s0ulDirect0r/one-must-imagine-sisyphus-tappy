



let audioCtx: AudioContext;
let buffer: AudioBuffer;
let source: AudioBufferSourceNode | null = null;
let startTime = 0; // AudioContext.currentTime when playback starts
let bpm = 136; // hardcoded for now
let songDuration = 0;


// loads audio and audio metadata, returns metadata

/*
export async function loadAudio() { 
    const bpm = 68 //theoretically get BPM from an API, i just hard coded it this time

    await new Promise<void>((resolve, reject) => {
        audio.addEventListener("loadedmetadata", () => resolve(), { once: true });
        audio.addEventListener("error", reject, { once: true });
        audio.load();
    });
    return { currentTime: audio.currentTime, bpm: bpm, songDuration: audio.duration, }


}
*/

export async function loadAudio(url: string = "/assets/garbage.mp3") {
    if (!audioCtx) audioCtx = new AudioContext();

    // Fetch and decode audio
    const arrayBuffer = await fetch(url).then(r => r.arrayBuffer());
    buffer = await audioCtx.decodeAudioData(arrayBuffer);
    songDuration = buffer.duration;

    return {
        bpm,
        songDuration,
    };
}

let audioPlaying = false



export function playAudio(offset: number = 0) {
    if (!audioCtx || !buffer) throw new Error("Audio not loaded");

    // Stop any previous source
    if (source) source.stop();

    source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);

    startTime = audioCtx.currentTime - offset; // startTime adjusted for offset
    source.start(audioCtx.currentTime, offset);
    audioPlaying = true
}

// gets the current time elapsed of the song
/*
export function getCurrentAudioTime() {
    return audio.currentTime


}
*/


export function getCurrentAudioTime() {
    if (!audioCtx || !source) return 0;
    return audioCtx.currentTime - startTime; // seconds, precise


    // loads new song, plays it, returns new audio metadata

    /*
    export async function playAudio() {
    
    
    
    
        audio.play()
    
    
    
    }
    
    */
}



// chckecs to see if Audio is still playing
export function isAudioPlaying() {
    return isAudioPlaying




}
