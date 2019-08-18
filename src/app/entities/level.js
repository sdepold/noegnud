import { SpriteSheet, Sprite } from "kontra";
import { getImage } from "../helper";

const tileSize = 16.0;
const renderedTileSize = 32;

export default class Level {
  constructor(width, height) {
    this.height = ~~(height / renderedTileSize);
    this.width = ~~(width / renderedTileSize) - 1;
    this.tiles = this.generate();
  }

  getSprites() {
    if (!this.sprites) {
      const image = document.querySelector("#level");

      this.sprites = this.tiles.map(tile => {
        const spriteSheet = SpriteSheet({
          image: image,
          frameWidth: tileSize,
          frameHeight: tileSize,
          animations: {
            ground: {
              frames: `${tile.frame}..${tile.frame}`,
              frameRate: 1000
            }
          }
        });

        return Sprite({
          type: "tile",
          x: tile.x * renderedTileSize,
          y: tile.y * renderedTileSize,
          height: renderedTileSize,
          width: renderedTileSize,
          animations: spriteSheet.animations
        });
      });
    }

    return this.sprites;
  }

  generate() {
    let tiles = [];

    for (let y = 0; y <= this.height; y++) {
      for (let x = 0; x <= this.width; x++) {
        const floorTileFrame = (Math.random() < 0.2) ? ~~(Math.random() * 3) : 0;
        const wallTileFrame = (Math.random() < 0.1) ? (15 + ~~Math.random()) : 4;

        if (y === 0) {
          if (x === 0) {
            tiles.push({ x, y, frame: 12 });
          } else if (x === this.width) {
            tiles.push({ x, y, frame: 14 });
          } else {
            tiles.push({ x, y, frame: 13 });
          }
        } else if (y === 1) {
          if (x === 0) {
            tiles.push({ x, y, frame: 8 });
          } else if (x === this.width) {
            tiles.push({ x, y, frame: 9 });
          } else {
            tiles.push({ x, y, frame: wallTileFrame });
          }
        } else if (y === this.height - 1) {
          tiles.push({ x, y, frame: floorTileFrame });

          if (x === 0) {
            tiles.push({ x, y, frame: 6 });
          } else if (x === this.width) {
            tiles.push({ x, y, frame: 7 });
          } else {
            tiles.push({ x, y, frame: floorTileFrame });
            tiles.push({ x, y, frame: 13 });
          }
        } else if (y === this.height) {
          if (x === 0) {
            tiles.push({ x, y, frame: 3 });
          } else if (x === this.width) {
            tiles.push({ x, y, frame: 5 });
          } else {
            tiles.push({ x, y, frame: wallTileFrame });
          }
        } else {
          tiles.push({ x, y, frame: floorTileFrame });

          if (x === 0) {
            tiles.push({ x, y, frame: 10 });
          } else if (x === this.width) {
            tiles.push({ x, y, frame: 11 });
          }
        }
      }
    }

    return tiles;
  }
}
