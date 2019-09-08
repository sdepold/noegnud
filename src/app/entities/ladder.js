import Sprite from "kontra/src/sprite";
import { getCanvas } from "kontra/src/core";

export default class Ladder {
  getSprites() {
    if (!this.ladder) {
      const width = getCanvas().width / 2;

      this.ladder = Sprite({
        type: "ladder",
        color: "RGBA(182, 156, 138, 1.00)",
        x: 30 + Math.random() * width - 60,
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

    return [this.ladder];
  }
}
