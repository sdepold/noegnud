import Sprite from "kontra/src/sprite";
import { getCanvas } from "kontra/src/core";

export default class PauseScreen {
  constructor(player, level, controller) {
    this.player = player;
    this.level = level;
    this.controller = controller;
  }

  hide() {
    document.querySelector("#controller-disabled").id = "controller";
    this.hide = true;
  }

  getSprites() {
    if (this.hide) {
      return [];
    }

    if (!this.sprite) {
      document.querySelector("#controller").id = "controller-disabled";

      const canvas = getCanvas();
      this.sprite = Sprite({
        x: 0,
        y: 0,
        height: canvas.height,
        width: canvas.width,
        opacity: 0,
        render() {
          this.context.save();

          this.context.globalAlpha = this.opacity;
          this.context.fillStyle = "black";
          this.context.fillRect(this.x, this.y, this.width, this.height);
          this.context.font = "10px Marker Felt";
          this.context.fillStyle = "white";

          this.context.fillText("You died :(", 10, 50);
          this.context.restore();
        },
        update() {
          this.advance();
          if (this.opacity < 0.75) {
            this.opacity += 0.02;
          }
        }
      });
    }

    return [this.sprite];
  }
}
