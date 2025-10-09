
// current audio
let audio = new Audio("/assets/garbage.mp3")


// loads audio and audio metadata, returns metadata
export async function loadAudio() {
    const bpm = 68 //theoretically get BPM from an API, i just hard coded it this time

    await new Promise<void>((resolve, reject) => {
        audio.addEventListener("loadedmetadata", () => resolve(), { once: true });
        audio.addEventListener("error", reject, { once: true });
        audio.load();
    });
    return { currentTime: audio.currentTime, bpm: bpm, songDuration: audio.duration, }


}

// gets the current time elapsed of the song
export function getCurrentAudioTime() {
    return audio.currentTime


}


// loads new song, plays it, returns new audio metadata


export async function playAudio() {




    audio.play()



}


// chckecs to see if Audio is still playing
export function isAudioPlaying() {
    if (audio.currentTime > 0 && !audio.paused && !audio.ended) {
        return true
    } else {
        return false
    }





}
