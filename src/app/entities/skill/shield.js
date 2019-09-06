import Sprite from "kontra/src/sprite";

const ROTATION_MAP = [0, Math.PI, Math.PI / 2, -Math.PI / 2];

export default function skillShield(player) {
  return Sprite({
    type: "shield",
    height: 3,
    width: 20,
    sAlpha: 1,
    sAlphaDirection: 0.01,
    anchor: { x: 0.5, y: 0.5 },
    distance: 50,
    render() {
      this.__proto__.render.call(this);
    },
    update() {
      this.advance();
      this.color = `rgba(200, 200, 200, ${this.sAlpha})`;
      this.sAlpha += this.sAlphaDirection;

      if (this.sAlpha <= 0.3) {
        this.sAlphaDirection = 0.01;
      } else if (this.sAlpha >= 1) {
        this.sAlphaDirection = -0.01;
      }

      if (!this.rotation) {
        this.rotation =
          ROTATION_MAP[
            player.skills
              .filter(s => s && s.type === "shield")
              .findIndex(s => s === this)
          ];
      }

      this.rotation += 0.02;

      const playerCenter = {
        x: player.playerSprite.x + player.playerSprite.width / 2,
        y: player.playerSprite.y + player.playerSprite.height / 2 + 8
      };

      if (!this.y) {
        this.x = playerCenter.x;
        this.y = playerCenter.y - this.distance;
      } else {
        const cosTheta = Math.cos(this.rotation);
        const sinTheta = Math.sin(this.rotation);
        const pos = {
          x: sinTheta * this.distance + playerCenter.x,
          y: cosTheta * -this.distance + playerCenter.y
        };

        this.x = pos.x;
        this.y = pos.y;
      }
    }
  });
}

skillShield.title = "Shield";
skillShield.type = "shield";
