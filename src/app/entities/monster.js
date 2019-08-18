import kontra from "kontra";

export default class Monster {
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
        type: 'monster',
        x: 100,
        y: 100,
        dx: Math.random() * 4 - 2,
        dy: Math.random() * 4 - 2,
        height: 52,
        width: 32,

        animations: spriteSheet.animations
      });

      const originalUpdate = this.sprite.update.bind(this.sprite);

      this.sprite.update = function () {
        const canvas = kontra.getCanvas();

        originalUpdate();

        if (this.x < 10 || this.x > (canvas.width - 32)) {
          this.dx *= -1;
        }

        if (this.y < 16 || this.y > (canvas.height - 82)) {
          this.dy *= -1;
        }
      }.bind(this.sprite);
    }

    return this.sprite;
  }
}
