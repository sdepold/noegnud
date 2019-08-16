import kontra from "kontra";

export default class Player {
  constructor(game) {
    this.game = game;
    this.y = 100;
    this.size = 52;
    this.swordSpeed = 0.3;
  }

  getSprites() {
    return [this.getPlayerSprite(), this.getWeaponSprite()];
  }

  getWeaponSprite() {
    if (!this.weaponSprite) {
      const player = this;

      this.weaponSprite = kontra.Sprite({
        x: 40,
        y: 0,
        height: 37,
        width: 15,
        image: document.querySelector("#sword"),
        anchor: {x: 0, y: 1},
        rotation: 0,
        rotationDelta: player.swordSpeed,
        update() {
          if(this.animate) {
            this.rotation = this.rotation + this.rotationDelta;
          }

          if (this.rotation >= 2) {
            this.rotationDelta = -player.swordSpeed;
          }

          if (this.rotation < 0) {
            this.rotationDelta = player.swordSpeed;
            this.rotation = 0;
            this.animate = false;
          }
        }
      });
    }

    return this.weaponSprite;
  }

  hit() {
    if (!this.weaponSprite.animate) {
      this.weaponSprite.animate = true;
    }
  }

  getPlayerSprite() {
    if (!this.playerSprite) {
      const image = document.querySelector("#chars");
      const spriteSheet = kontra.SpriteSheet({
        image: image,
        frameWidth: 16,
        frameHeight: 26,
        animations: {
          walk: {
            frames: "0..3",
            frameRate: 8
          }
        }
      });

      this.playerSprite = kontra.Sprite({
        x: 10,
        y: this.y - this.size,
        height: 52,
        width: 32,
        animations: spriteSheet.animations,
        view: 'right'
      });

      this.bindEvents();
    }

    return this.playerSprite;
  }

  bindEvents() {
    const originalUpdate = this.playerSprite.update;
    const player = this;

    this.playerSprite.update = function() {
      originalUpdate.call(this);

      player.weaponSprite.x = this.x + 15;
      player.weaponSprite.y = this.y + 35;

      if (kontra.keyPressed("left")) {
        this.dx = -5;
      } else if (kontra.keyPressed("right")) {
        this.dx = 5;
      } else {
        this.dx = 0;
      }

      if (kontra.keyPressed("up")) {
        this.dy = -5;
      } else if (kontra.keyPressed("down")) {
        this.dy = 5;
      } else {
        this.dy = 0;
      }

      if (kontra.keyPressed("space")) {
        player.hit();
      }
    }.bind(this.playerSprite);
  }
}
