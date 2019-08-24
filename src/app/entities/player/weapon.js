import kontra from "kontra";

export default class Weapon {
  constructor(player) {
    this.player = player;

    this.syncPosition(player.getPlayerSprite());
  }

  syncPosition({ x, y }) {
    const sprite = this.getSprites();

    if (!this.animate) {
      sprite.x = x + 35;
      sprite.y = y + 25;
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
        height: 38,
        width: 16,
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
    const speed = 5;

    const tx =
      target.x +
      this.sprite.width / 2 -
      (this.sprite.x + this.sprite.width / 2);
    const ty =
      target.y +
      this.sprite.height / 2 -
      (this.sprite.y + this.sprite.height / 2);
    const dist = Math.sqrt(tx * tx + ty * ty);
    const targetDx = tx / dist * speed;
    const targetDy = ty / dist * speed;

    this.sprite.dx = targetDx;
    this.sprite.dy = targetDy;
    this.animate = true;
    this.sprite.ttl = 75;
  }
}
