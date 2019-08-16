import kontra from "kontra";
import resources from "../resources";
import { getImage, log } from "../helper";

export default class Platform {
  constructor (x, y, width, height) {
    this.width = Math.ceil(width / 32.0) * 32;
    this.height = height;
    this.x = x;
    this.y = y;
    this.type = 'platform';
  }

  async getSprites() {
    if (this.sprites) {
      return this.sprites;
    }

    let sprites = [];
    const image = await getImage(resources.grassTop);
    const platform = kontra.Sprite({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fill: "#A57C55",
      stroke: "#895C39",
      render() {
        this.context.beginPath();

        this.context.strokeStyle = this.stroke;
        this.context.fillStyle = this.fill;

        this.context.strokeRect(this.x, this.y, this.width, this.height);
        this.context.fillRect(this.x, this.y, this.width, this.height);

        this.context.closePath();
      }
    });

    sprites.push(platform);

    for (let offset = 0; offset < this.width; offset = offset + 32) {
      sprites.push(
        kontra.Sprite({
          x: this.x + offset,
          y: this.y,
          width: 32,
          height: 32,
          image
        })
      );
    }

    return this.sprites = sprites;
  }
}
