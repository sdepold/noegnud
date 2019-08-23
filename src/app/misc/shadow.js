export function addShadow(
  sprite,
  { x = 0, color = "rgba(0, 0, 0, 0.5)" } = {}
) {
  const originalRender = sprite.render.bind(sprite);

  sprite.shadowColor = color;

  sprite.render = function() {
    this.context.save();
    this.context.beginPath();
    this.context.shadowColor = this.context.fillStyle = sprite.shadowColor;
    this.context.ellipse(
      this.x + this.width / 2 + x,
      this.y + this.height,
      this.width / 2,
      5,
      0,
      0,
      2 * Math.PI
    );

    this.context.shadowBlur = 10;

    this.context.fill();
    this.context.restore();

    originalRender();
  }.bind(sprite);
}
