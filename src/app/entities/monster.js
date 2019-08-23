import kontra from "kontra";
import { addShadow } from "../misc/shadow";
import { addHealth } from "../misc/health";
import Base from "./base";

export default class Monster extends Base {
  constructor({ level = 10 } = {}) {
    super({ level });
  }

  getSprites() {
    return [this.getMonsterSprite()];
  }

  getMonsterSprite() {
    if (!this.sprite) {
      const image = document.querySelector("#chars");
      const spriteSheet = kontra.SpriteSheet({
        image: image,
        frameWidth: 16,
        frameHeight: 26,
        animations: {
          walk: {
            frames: "9..12",
            frameRate: 8
          }
        }
      });

      this.sprite = kontra.Sprite({
        entity: this,
        type: "monster",
        x: 100,
        y: 100,
        dx: Math.random() * 3 - 2,
        dy: Math.random() * 3 - 2,
        height: 52,
        width: 32,
        animations: spriteSheet.animations,

        update() {
          this.advance();

          if (this.targeted) {
            this.shadowColor = "rgba(250, 100, 100, 0.7)";
          } else {
            this.shadowColor = "rgba(0, 0, 0, 0.5)";
          }

          if (this.x < 10 || this.x > canvas.width - 32) {
            this.dx *= -1;
          }

          if (this.y < 16 || this.y > canvas.height - 82) {
            this.dy *= -1;
          }
        }
      });

      addShadow(this.sprite, { x: -5 });
      addHealth(this, this.sprite, { x: -5, y: 10 });
    }

    return this.sprite;
  }
}
