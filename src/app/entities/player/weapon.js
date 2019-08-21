import kontra from "kontra";

export default class Weapon {
  constructor(player) {
    this.player = player;
  }

  syncPosition({ x, y }) {
    if (!this.animate) {
      this.sprite.x = x + 15;
      this.sprite.y = y + 35;
    }
  }

  getSprites() {
    if (!this.sprite) {
      const weapon = this;
      const player = this.player;

      this.sprite = kontra.Sprite({
        type: "weapon",
        x: 40,
        y: 50,
        dx: 0,
        height: 38,
        width: 16,
        image: document.querySelector("#sword"),
        anchor: { x: 0, y: 1 },
        rotation: 0,
        rotationDelta: player.swordSpeed,
      });

      const spriteUpdate = this.sprite.update.bind(this.sprite);

      this.sprite.update = function() {
        spriteUpdate();

        if (weapon.animate) {
          this.rotation = this.rotation + player.swordSpeed;
        }
      }.bind(this.sprite);
    }

    return this.sprite;
  }

  throw(target) {
    this.target = target;

    let targetDX = target.x - this.sprite.x;
    let targetDY = target.y - this.sprite.y;

    // Normalize
    const targetLength = Math.sqrt(target.x * target.x + target.y * target.y);
    targetDX = targetDX / targetLength;
    targetDY = targetDY / targetLength;

    this.sprite.dx = targetDX * 10;
    this.sprite.dy = targetDY * 10;
    this.animate = true;
    this.sprite.ttl = 75;
  }
}
