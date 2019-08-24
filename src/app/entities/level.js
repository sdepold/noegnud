import { SpriteSheet, Sprite, TileEngine } from "kontra";
import { getImage } from "../misc/helper";

const tileSize = 32.0;
const renderedTileSize = 32;

export default class Level {
  constructor(width, height) {
    this.height = ~~(height / renderedTileSize);
    this.width = ~~(width / renderedTileSize) - 1;
    this.tilesGround = this.generateGround();
    this.tilesWalls = this.generateDecor();
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

  generateGround() {
    let tiles = [];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x <= this.width; x++) {
        const floorTileFrame =
          1 + (Math.random() < 0.2 ? ~~(Math.random() * 3) : 0);
        const wallTileFrame =
          1 + (Math.random() < 0.1 ? 15 + ~~Math.random() : 4);

        if (y === 0) {
          if (x === 0) {
            tiles.push(13);
          } else if (x === this.width) {
            tiles.push(14);
          } else {
            tiles.push(13);
          }
        } else if (y === 1) {
          if (x === 0) {
            tiles.push(9);
          } else if (x === this.width) {
            tiles.push(10);
          } else {
            tiles.push(wallTileFrame);
          }
        } else if (y === this.height - 2) {
          tiles.push(floorTileFrame);
        } else if (y === this.height - 1) {
          if (x === 0) {
            tiles.push(4);
          } else if (x === this.width) {
            tiles.push(6);
          } else {
            tiles.push(wallTileFrame);
          }
        } else {
          tiles.push(floorTileFrame);
        }
      }
    }

    return tiles;
  }

  generateDecor() {
    let tiles = [];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x <= this.width; x++) {
        if (y === 0) {
          tiles.push(0);
        } else if (y === 1) {
          tiles.push(0);
        } else if (y === this.height - 2) {
          if (x === 0) {
            tiles.push(7);
          } else if (x === this.width) {
            tiles.push(8);
          } else {
            tiles.push(14);
          }
        } else if (y === this.height - 1) {
          tiles.push(0);
        } else {
          if (x === 0) {
            tiles.push(11);
          } else if (x === this.width) {
            tiles.push(12);
          } else {
            tiles.push(Math.random() < 0.01 ? 18 : 0);
          }
        }
      }
    }

    return tiles;
  }
}
