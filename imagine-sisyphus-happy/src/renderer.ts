import { Application, Assets, Sprite } from "pixi.js";
import { GameState } from "./stateMachine";
import { initializeUIElements, renderUI } from "./ui";
import { initDevtools } from "@pixi/devtools";
import { loadAudio } from "./audio";
import { setUpMetronome } from "./metronome";

let app: Application;
let treeTexture: any

const myTrees: Map<string, Sprite> = new Map();

// Initialize the application
export async function initialize(gameState: GameState) {
  // Create a new application
  app = new Application();
  initDevtools({ app });

  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  //Load song, setup metronome with song 

  const { currentTime, bpm, songDuration } = await loadAudio()

  gameState.songBpm = bpm;
  gameState.songDuration = songDuration;
  gameState.timePassedSinceSongStarted = currentTime;
  gameState.needsAudio = false;
  setUpMetronome(bpm)


  treeTexture = await Assets.load("/assets/tree.png");

  initializeUIElements(app);
}

// TODO: split rendering into the scene itself and the UI
// TODO: write the UI
export async function render(gameState: GameState) {
  renderTrees(gameState.trees);
  renderUI(gameState.elevation, gameState.streak);
}

function renderTrees(trees: Tree[]) {
  trees.forEach(tree => {
    const treeSprite = myTrees.get(tree.id)
    if (treeSprite) {
      treeSprite.position.set(tree.x, tree.y)
    } else {
      const newSprite = new Sprite(treeTexture);
      newSprite.position.set(tree.x, tree.y)
      app.stage.addChild(newSprite)
      myTrees.set(tree.id, newSprite)
    }
  })
}
