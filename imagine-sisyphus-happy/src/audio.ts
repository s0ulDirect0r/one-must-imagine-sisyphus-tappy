// Button will be pressed to run this function

//takes file path of song
export async function playAudio(song: string) {
    const bpm = 136 //theoretically get BPM from an API, i just hard coded it this time
    const audio = new Audio(song)
    let duration = 0

    await audio.addEventListener("loadedmetadata", () => {
        duration = audio.duration
        audio.play();
    });
    return { songTime: 0, bpm: bpm, songDuration: duration }


}