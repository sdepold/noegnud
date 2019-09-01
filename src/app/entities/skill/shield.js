import Sprite from "kontra/src/sprite";

export default function skillShield(player) {
  return Sprite({
    type: "shield",
    height: 3,
    width: 20,
    color: "green",
    anchor: { x: 0.5, y: 0.5 },
    distance: 50,
    render() {
        this.__proto__.render.call(this);
    },
    update() {
      this.advance();

      this.rotation += 0.05;

      const playerCenter = {
        x: player.playerSprite.x + player.playerSprite.width / 2,
        y: player.playerSprite.y + player.playerSprite.height / 2
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
