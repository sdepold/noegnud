import Sprite from "kontra/src/sprite";
import { addShadow } from "./misc/shadow";

const LENGTH = 10;

export default class TombStone {
  constructor(obj) {
    this.object = obj;
  }

  gS() {
    const { x, y } = this.object;

    if (!this.sprites) {
      const text = [1,2,3,4,5].map(()=>LENGTH * Math.min(0.8, Math.random()));

      this.sprites = Sprite({
        type: "tombstone",
        x: this.object.x,
        y: this.object.y,
        width: LENGTH * 1.6,
        height: LENGTH * 1.25,
        render() {
          this.context.beginPath();
          this.context.lineTo(x, y + LENGTH * 1.25);
          this.context.lineTo(x + LENGTH, y + LENGTH * 1.25);
          this.context.lineTo(x + LENGTH, y);
          this.context.lineTo(x + LENGTH * 0.75, y - LENGTH * 0.25);
          this.context.lineTo(x + LENGTH * 0.25, y - LENGTH * 0.25);
          this.context.lineTo(x, y);
          this.context.closePath();
          this.context.strokeStyle = "RGBA(113, 93, 138, 1.00)";
          this.context.fillStyle = "RGBA(162, 140, 186, 1.00)";
          this.context.fill();
          this.context.stroke();

          this.context.fillStyle = "RGBA(113, 93, 138, 1.00)";
          text.forEach((length, i) => {
            this.context.fillRect(
              x + LENGTH * 0.1,
              y + LENGTH * (0.2 + i * 0.2),
              length,
              1
            );
          });
        }
      });

      addShadow(this.sprites, { x: -3 });
    }

    return [this.sprites];
  }
}
