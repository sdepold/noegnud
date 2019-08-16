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
        x: 100,
        y: 100,
        dx: Math.random() * 4 - 2,
        dy: Math.random() * 4 - 2,
        height: 52,
        width: 32,

        animations: spriteSheet.animations
      });
    }

    return this.sprite;
  }
}

let asteroid = kontra.Sprite({
  x: 100,
  y: 100,
  dx: Math.random() * 4 - 2,
  dy: Math.random() * 4 - 2,
  radius: 30,
  render() {
    this.context.strokeStyle = "white";
    this.context.beginPath(); // start drawing a shape
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.context.stroke(); // outline the circle
  }
});
