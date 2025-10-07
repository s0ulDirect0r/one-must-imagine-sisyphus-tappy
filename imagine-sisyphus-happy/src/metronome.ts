import { generateLayoutHash } from "pixi.js"

let lastBeat = 0
let beatDurationMs: number
let nextBeatPosition: number


export function setUpMetronome(bpm: number) {
    beatDurationMs = 60 / bpm * 1000 // 60/beatsperminuetn = seconds per beat --> * 1000 = miliseconds per beat
    nextBeatPosition = beatDurationMs



}

// takes in current position of song and returns where the 
export function getPosition(musicPosition: number) {
    if ((musicPosition * 1000) >= nextBeatPosition!) {
        console.log("hello")
        lastBeat += 1
        nextBeatPosition += beatDurationMs




    }

    return lastBeat




}
