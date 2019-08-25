import kontra from "kontra";
import { getDirection } from "../../misc/helper";

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

      const spriteSheet = kontra.SpriteSheet({
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

      this.sprite = kontra.Sprite({
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
            this.rotation = this.rotation + player.swordSpeed;
          }
        }
      });
    }

    return this.sprite;
  }

  throw(target) {
    const {dx, dy} = getDirection(5, this.sprite, target);

    this.sprite.dx = dx;
    this.sprite.dy = dy;
    this.animate = true;
    this.sprite.ttl = 75;
  }
}
