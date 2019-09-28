import Sprite from "kontra/src/sprite";

const RM = [0, Math.PI, Math.PI / 2, -Math.PI / 2];

export default function skillShield(player) {
  return Sprite({
    type: "shield",
    height: 3,
    width: 20,
    a: 1,
    da: .01,
    anchor: { x: .5, y: .5 },
    distance: 50,
    update() {
      this.advance();
      this.color = `rgba(200, 200, 200, ${this.a})`;
      this.a += this.da;

      if (this.a <= .3) {
        this.da = .01;
      } else if (this.a >= 1) {
        this.da = -.01;
      }

      if (!this.rotation) {
        this.rotation =
          RM[
          player.skills
            .filter(s => s && s.type === "shield")
            .findIndex(s => s === this)
          ];
      }

      this.rotation += .02;

      const playerCenter = {
        x: player.playerSprite.x + player.playerSprite.width / 2,
        y: player.playerSprite.y + player.playerSprite.height / 2 + 8
      };

      if (!this.y) {
        this.x = playerCenter.x;
        this.y = playerCenter.y - this.distance;
      } else {
        const c = Math.cos(this.rotation);
        const t = Math.sin(this.rotation);
        const pos = {
          x: t * this.distance + playerCenter.x,
          y: c * -this.distance + playerCenter.y
        };

        this.x = pos.x;
        this.y = pos.y;
      }
    }
  });
}

skillShield.title = "Shield";
skillShield.type = "shield";
