import kontra from "kontra";

export function addKeyboardControls(player) {
  const originalUpdate = player.playerSprite.update;

  player.playerSprite.update = function() {
    originalUpdate.call(this);
    player.primaryWeapon && player.primaryWeapon.syncPosition(this)

    const closestMonster = player.game.getClosest(player.playerSprite, 'monster');

    if (closestMonster.distance < 200) {
      player.hit(closestMonster.sprite);
    }

    if (kontra.keyPressed("left")) {
      this.dx = -5 - player.charSpeedBuff;
    } else if (kontra.keyPressed("right")) {
      this.dx = 5 + player.charSpeedBuff;
    } else {
      this.dx = 0;
    }

    if (kontra.keyPressed("up")) {
      this.dy = -5 - player.charSpeedBuff;
    } else if (kontra.keyPressed("down")) {
      this.dy = 5 + player.charSpeedBuff;
    } else {
      this.dy = 0;
    }

    // if (kontra.keyPressed("space")) {
    //   player.hit();
    // }
  }.bind(player.playerSprite);
}

function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

export function addMouseControls(player) {
  const canvas = kontra.getCanvas();
  const sprite = player.playerSprite;

  canvas.addEventListener("touchmove", e => {
    e.preventDefault();

    const { clientX, clientY } = e.targetTouches[0];
    let targetDX = clientX - (sprite.x + (sprite.width / 2 ));
    let targetDY = clientY - (sprite.y + (sprite.height / 2 ));

    // Normalize
    const targetLength = Math.sqrt(clientX * clientX + clientY * clientY);
    targetDX = targetDX / targetLength;
    targetDY = targetDY / targetLength;

    sprite.dx = targetDX * 10;
    sprite.dy = targetDY * 10;
  });
  canvas.addEventListener(
    "touchend",
    e => {
        sprite.dx = 0;
        sprite.dy = 0;
    },
    false
  );
}
