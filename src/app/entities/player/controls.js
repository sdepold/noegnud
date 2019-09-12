import { getCanvas } from "kontra/src/core";

const setPlayerTarget = player => {
  const closestMonster = player.game.getClosest(player.playerSprite, "m");

  if (closestMonster && closestMonster.distance) {
    player.setTarget(closestMonster.sprite);
    player.hit();
  }
};

export function addKeyboardControls(player) {
  const originalUpdate = player.playerSprite.update.bind(player.playerSprite);
  const canvas = getCanvas();

  player.playerSprite.update = function() {
    this.prevX = this.x;
    this.prevY = this.y;

    const axis = player.controller.getAxis();

    this.dx = axis.x * 2;
    this.dy = axis.y * 2;

    if (
      (this.x < 6 && this.dx < 0) ||
      (this.x > canvas.width / 2 - 20 && this.dx > 0)
    ) {
      this.dx = 0;
    }

    if (
      (this.y < 16 && this.dy < 0) ||
      (this.y > canvas.height / 2 - 48 && this.dy > 0)
    ) {
      this.dy = 0;
    }

    originalUpdate();

    if (player.isMoving) {
      player.primaryWeapon && player.primaryWeapon.syncPosition(this);
      player.resetTarget();
    } else {
      setPlayerTarget(player);
    }
  }.bind(player.playerSprite);
}

export function addMouseControls(player) {
  const canvas = getCanvas();
  const sprite = player.playerSprite;

  canvas.addEventListener("touchstart", e => {
    player.resetTarget();
  });

  canvas.addEventListener("touchmove", e => {
    e.preventDefault();
  });

  canvas.addEventListener(
    "touchend",
    e => {
      sprite.dx = 0;
      sprite.dy = 0;
      setPlayerTarget(player);
    },
    false
  );
}
