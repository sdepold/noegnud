import kontra from "kontra";

const setPlayerTarget = player => {
  const closestMonster = player.game.getClosest(player.playerSprite, "monster");

  if (closestMonster.distance) {
    player.setTarget(closestMonster.sprite);
    player.hit();
  }
};

export function addKeyboardControls(player) {
  const originalUpdate = player.playerSprite.update;

  player.playerSprite.update = function() {
    this.prevX = this.x;
    this.prevY = this.y;

    originalUpdate.call(this);

    const axis = player.controller.getAxis();

    this.dx = axis.x * 2;
    this.dy = axis.y * 2;

    if (player.isMoving) {
      player.primaryWeapon && player.primaryWeapon.syncPosition(this);
      player.resetTarget();
    } else {
      setPlayerTarget(player);
    }
  }.bind(player.playerSprite);
}

function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

export function addMouseControls(player) {
  const canvas = kontra.getCanvas();
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
