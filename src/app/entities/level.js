import TileEngine from "kontra/src/tileEngine";
import devil from "./monster/devil";
import skullFace from "./monster/skull-face";

const tileSize = 16.0;
const renderedTileSize = 32;

const monstersDifficultyMap = {
  "10": player => [
    skullFace(player),
    // skullFace(player),
    // skullFace(player),
    // devil(player)
  ],
  "9": player => [
    skullFace(player),
    skullFace(player),
    skullFace(player),
    skullFace(player),
    skullFace(player)
  ],
  "8": player => [devil(player), devil(player)],
  "7": player => [skullFace(player)],
  "6": player => [skullFace(player)],
  "5": player => [skullFace(player)],
  "4": player => [skullFace(player)],
  "3": player => [skullFace(player)],
  "2": player => [skullFace(player)],
  "1": player => [skullFace(player)]
};

export default class Level {
  constructor(width, height, difficulty = 10) {
    this.height = ~~(height / renderedTileSize) + 1;
    this.width = ~~(width / renderedTileSize) - 1;
    this.difficulty = 10;
    this.setData();
  }

  getMonsters(player) {
    return monstersDifficultyMap[this.difficulty](player);
  }

  getSprites() {
    if (!this.tileEngine) {
      this.tileEngine = TileEngine({
        type: "tile",
        isAlive: () => true,
        // tile size
        tilewidth: tileSize,
        tileheight: tileSize,

        // map size in tiles
        width: this.width + 1,
        height: this.height,

        // tileset object
        tilesets: [
          {
            firstgid: 1,
            image: document.querySelector("#level")
          }
        ],

        // layer object
        layers: [
          {
            name: "ground",
            data: this.tilesGround
          },
          {
            name: "walls",
            data: this.tilesWalls
          }
        ]
      });
    }

    return [this.tileEngine];
  }

  setData() {
    let groundTiles = [];
    let decorTiles = [];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x <= this.width; x++) {
        const floorTileFrame =
          1 + (Math.random() < 0.2 ? ~~(Math.random() * 3) : 0);
        const wallTileFrame =
          1 + (Math.random() < 0.2 ? 15 + ~~Math.random() : 4);

        if (y === 0) {
          decorTiles.push(0);
          if (x === 0) {
            groundTiles.push(13);
          } else if (x === this.width) {
            groundTiles.push(14);
          } else {
            groundTiles.push(13);
          }
        } else if (y === 1) {
          decorTiles.push(0);

          if (x === 0) {
            groundTiles.push(9);
          } else if (x === this.width) {
            groundTiles.push(10);
          } else {
            groundTiles.push(wallTileFrame);
          }
        } else if (y === this.height - 2) {
          groundTiles.push(floorTileFrame);

          if (x === 0) {
            decorTiles.push(7);
          } else if (x === this.width) {
            decorTiles.push(8);
          } else {
            decorTiles.push(14);
          }
        } else if (y === this.height - 1) {
          decorTiles.push(0);

          if (x === 0) {
            groundTiles.push(4);
          } else if (x === this.width) {
            groundTiles.push(6);
          } else {
            groundTiles.push(wallTileFrame);
          }
        } else {
          groundTiles.push(floorTileFrame);

          if (x === 0) {
            decorTiles.push(11);
          } else if (x === this.width) {
            decorTiles.push(12);
          } else {
            decorTiles.push(Math.random() < 0.01 ? 18 : 0);
          }
        }
      }
    }

    this.tilesGround = groundTiles;
    this.tilesWalls = decorTiles;
  }
}
