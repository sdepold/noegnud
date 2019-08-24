export function addHealth(entity, sprite, _adjustments) {
  const originalUpdate = sprite.update.bind(sprite);
  const originalRender = sprite.render.bind(sprite);
  const adjustments = { x: 0, y: 0, ..._adjustments };

  sprite.update = function() {
    if (entity.prevHealth && entity.prevHealth !== entity.health) {
      this.playAnimation("ouch");
      setTimeout(() => {
        this.playAnimation("walk");
      }, 500);
    }
    entity.prevHealth = entity.health;

    originalUpdate();
  }.bind(sprite);

  sprite.render = function() {
    if (entity.health < 100) {
      const x = sprite.x + adjustments.x;
      const y = sprite.y + adjustments.y;
      const width = sprite.width;
      const height = 5;

      this.context.save();
      this.context.beginPath();
      this.context.strokeStyle = "rgba(0,0,0,1)";
      this.context.fillStyle = "rgba(100,100,100,0.7)";
      this.context.rect(x, y, width, height);
      this.context.fill();
      this.context.stroke();
      this.context.closePath();
      this.context.beginPath();
      this.context.fillStyle = getBarColor(entity);
      this.context.rect(x, y, width / 100 * entity.health, height);
      this.context.fill();

      this.context.restore();
    }

    originalRender();
  }.bind(sprite);
}

function getBarColor(entity) {
  if (entity.health > 70) {
    return "rgba(100, 250, 100, 0.7)";
  } else if (entity.health > 40) {
    return "rgba(255, 255, 100, 0.7)";
  } else {
    return "rgba(255, 100, 100, 0.7)";
  }
}
