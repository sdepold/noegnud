import TileEngine from "kontra/src/tileEngine";
import devil from "./monster/devil";
import skullFace from "./monster/skull-face";
import seedy from "./monster/seedy";

const tileSize = 16.0;
const renderedTileSize = 32;
const monstersDifficultyMap = {
  //keep all skills
  "10": player => [
    seedy(player),
    skullFace(player),
    skullFace(player),
    devil(player)
  ],
  //remove 1 out of 4 skills
  "9": player => [
    devil(player),
    devil(player),
    skullFace(player),
    skullFace(player)
  ],
  //keep all skills
  "8": player => [
    devil(player),
    seedy(player)
  ],
  //remove 1 out of 3 remaining skills
  "7": player => [
    skullFace(player),
    skullFace(player),
    skullFace(player),
    skullFace(player)
  ],
  //keep all skills
  "6": player => [
    seedy(player),
    seedy(player),
    skullFace(player),
  ],
  //remove 1 out of 2 remaining skills
  "5": player => [
    skullFace(player),
    skullFace(player),
    skullFace(player),
    skullFace(player),
  ],
  //keep all skills
  "4": player => [
    devil(player),
    devil(player)
  ],
  //remove 1 out of 1 remaining skills
  "3": player => [
    seedy(player),
    skullFace(player),
    skullFace(player)
  ],
  //keep all skills
  "2": player => [
    devil(player)
  ],
  // win the game!
  "1": player => [
    seedy(player),
    skullFace(player)
  ]
};

export default class Level {
  constructor(width, height, difficulty = 10) {
    this.height = ~~(height / renderedTileSize) + 1;
    this.width = ~~(width / renderedTileSize) - 1;
    this.difficulty = 10;
  }

  getMonsters(player) {
    return monstersDifficultyMap[this.difficulty](player);
  }

  reset() {
    this.setData();
    this.tileEngine = TileEngine({
      type: "tiles",
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
          image: document.querySelector("#ladder")
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

  getSprites() {
    if (!this.tileEngine) {
      this.reset();
    }

    return [this.tileEngine];
  }

  setData() {
    let groundTiles = [];
    let decorTiles = [];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x <= this.width; x++) {
        const floorTileFrame =
          1 + (Math.random() < 0.2 ? ~~(Math.random() * 2) : 0);
        const wallTileFrame =
          1 + (Math.random() < 0.2 ? 14 + ~~Math.random() : 3);

        if (y === 0) {
          decorTiles.push(0);
          if (x === 0) {
            groundTiles.push(12);
          } else if (x === this.width) {
            groundTiles.push(13);
          } else {
            groundTiles.push(12);
          }
        } else if (y === 1) {
          decorTiles.push(0);

          if (x === 0) {
            groundTiles.push(8);
          } else if (x === this.width) {
            groundTiles.push(9);
          } else {
            groundTiles.push(wallTileFrame);
          }
        } else if (y === this.height - 2) {
          groundTiles.push(floorTileFrame);

          if (x === 0) {
            decorTiles.push(6);
          } else if (x === this.width) {
            decorTiles.push(7);
          } else {
            decorTiles.push(13);
          }
        } else if (y === this.height - 1) {
          decorTiles.push(0);

          if (x === 0) {
            groundTiles.push(3);
          } else if (x === this.width) {
            groundTiles.push(5);
          } else {
            groundTiles.push(wallTileFrame);
          }
        } else {
          groundTiles.push(floorTileFrame);

          if (x === 0) {
            decorTiles.push(10);
          } else if (x === this.width) {
            decorTiles.push(11);
          } else {
            decorTiles.push(0);
          }
        }
      }
    }

    this.tilesGround = groundTiles;
    this.tilesWalls = decorTiles;
  }
}
