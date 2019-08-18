import { SpriteSheet, Sprite, TileEngine } from "kontra";
import { getImage } from "../helper";

const tileSize = 16.0;

export default class Level2 {
  constructor(width, height) {
    this.height = ~~(height / tileSize);
    this.width = ~~(width / tileSize);
    this.tiles = this.generate();
  }

  getSprites() {
    const img = await getImage(
      "https://straker.github.io/kontra/assets/imgs/mapPack_tilesheet.png"
    );
    let tileEngine = TileEngine({
      // tile size
      tilewidth: 64,
      tileheight: 64,

      // map size in tiles
      width: 9,
      height: 9,

      // tileset object
      tilesets: [
        {
          firstgid: 1,
          image: img
        }
      ],

      // layer object
      layers: [
        {
          name: "ground",
          data: [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            6,
            7,
            7,
            8,
            0,
            0,
            0,
            0,
            6,
            27,
            24,
            24,
            25,
            0,
            0,
            0,
            0,
            23,
            24,
            24,
            24,
            26,
            8,
            0,
            0,
            0,
            23,
            24,
            24,
            24,
            24,
            26,
            8,
            0,
            0,
            23,
            24,
            24,
            24,
            24,
            24,
            25,
            0,
            0,
            40,
            41,
            41,
            10,
            24,
            24,
            25,
            0,
            0,
            0,
            0,
            0,
            40,
            41,
            41,
            42,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ]
        }
      ]
    });

    return tileEngine;
  }

  generate() {
    let tiles = [];

    for (let y = 0; y <= this.height; y++) {
      for (let x = 0; x <= this.width; x++) {
        if (y === 0) {
          if (x === 0) {
            tiles.push({ x, y, frame: 7 });
          } else if (x === this.width) {
            tiles.push({ x, y, frame: 8 });
          } else {
            tiles.push({ x, y, frame: 9 });
          }
        } else if (y === this.height) {
          if (x === 0) {
            tiles.push({ x, y, frame: 5 });
          } else if (x === this.width) {
            tiles.push({ x, y, frame: 6 });
          } else {
            tiles.push({ x, y, frame: 0 });
          }
        } else {
          if (x === 0 || x === this.width) {
            tiles.push({ x, y, frame: 6 });
          } else {
            tiles.push({ x, y, frame: 1 });
          }
        }
      }
    }

    return tiles;
  }
}
