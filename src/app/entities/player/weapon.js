import Sprite from "kontra/src/sprite";
import SpriteSheet from "kontra/src/spriteSheet";
import { getDirection } from "../../misc/helper";
import { getCanvas } from "kontra/src/core";

export default class Weapon {
  constructor(player) {
    this.player = player;

    this.syncPosition(player.getPlayerSprite());
  }

  syncPosition({ x, y }) {
    const sprite = this.getSprites();

    if (!this.animate) {
      sprite.x = x + 20;
      sprite.y = y + 15;
    }
  }

  getSprites() {
    if (!this.sprite) {
      const weapon = this;
      const player = this.player;

      const spriteSheet = SpriteSheet({
        image: document.querySelector("#weapons"),
        frameWidth: 8,
        frameHeight: 19,
        animations: {
          weapon: {
            frames: "0..0",
            frameRate: 1
          }
        }
      });

      const canvas = getCanvas();

      this.sprite = Sprite({
        entity: weapon,
        type: "weapon",
        x: 40,
        y: 50,
        dx: 0,
        height: 19,
        width: 8,
        animations: spriteSheet.animations,
        anchor: { x: 0.5, y: 0.5 },
        rotation: 0,
        rotationDelta: player.swordSpeed,
        update() {
          this.advance();

          if (weapon.animate) {
            if (
              this.x < 6 ||
              this.x > canvas.width / 2 - 20 ||
              this.y < 16 ||
              this.y > canvas.height / 2 - 48
            ) {
              this.ttl = 0;
            }
            this.rotation = this.rotation + player.swordSpeed;
          }
        }
      });
    }

    return this.sprite;
  }

  throw(target) {
    const { dx, dy } = getDirection(5, this.sprite, target);

    this.sprite.dx = dx;
    this.sprite.dy = dy;
    this.animate = true;
    this.sprite.ttl = 75;
  }
}
