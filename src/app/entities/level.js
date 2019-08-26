import TileEngine from "kontra/src/tileEngine";
import Sprite from "kontra/src/sprite";

const tileSize = 16.0;
const renderedTileSize = 32;

export default class Level {
  constructor(width, height) {
    this.height = ~~(height / renderedTileSize) + 1;
    this.width = ~~(width / renderedTileSize) - 1;
    this.setData();
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

    if (!this.ladder) {
      this.ladder = Sprite({
        color: "RGBA(182, 156, 138, 1.00)",
        x: Math.random() * this.tileEngine.mapwidth,
        y: 18,
        height: 2,
        width: 6,
        render() {
          this.context.save();
          this.context.shadowColor = "rgba(0,0,0,1)";
          this.context.strokeStyle = this.color;

          this.context.beginPath();
          this.context.moveTo(this.x, this.y);
          this.context.lineTo(this.x, this.y + this.height);
          this.context.moveTo(this.x + this.width, this.y);
          this.context.lineTo(this.x + this.width, this.y + this.height);

          for (let offset = 2; offset < this.height; offset += 2) {
            this.context.moveTo(this.x, this.y + offset);
            this.context.lineTo(this.x + this.width, this.y + offset);
          }

          this.context.shadowBlur = 10;

          this.context.stroke();
          this.context.restore();
        },
        update() {
          this.advance();
          if (this.height < 19) {
            this.height += 0.1;
          }
        }
      });
    }

    return [this.tileEngine, this.ladder];
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
