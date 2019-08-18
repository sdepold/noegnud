import kontra from "kontra";
import generateSkills from "../skill-generator";

export default class Player {
  constructor(game) {
    this.game = game;
    this.y = 100;
    this.size = 52;
    this._power = 10;
    this.powerBuff = 0;
    this._swordSpeed = 0.3;
    this.swordSpeedBuff = 0;
    this.charSpeedBuff = 0;
    this.skills = generateSkills(5);
    this.level = 10;

    this.skills.forEach(skill => skill.effect(this));
  }

  get swordSpeed() {
    return this._swordSpeed + this.swordSpeedBuff;
  }

  get power() {
    return this._power + this.powerBuff;
  }

  getSprites() {
    const skillSprites = this.skills.reduce((acc, skill, i) => {
      const skillSprite = skill.getSprites()[0];

      skillSprite.x = (i+1) * (skillSprite.width + 10) - 30;

      return acc.concat(skillSprite);
    }, []);

    const allSprites = skillSprites.concat([
      this.getPlayerSprite(),
      this.getWeaponSprite()
    ]);

    return allSprites;
  }

  getWeaponSprite() {
    if (!this.weaponSprite) {
      const player = this;

      this.weaponSprite = kontra.Sprite({
        type: 'weapon',
        x: 40,
        y: 0,
        height: 37,
        width: 15,
        image: document.querySelector("#sword"),
        anchor: { x: 0, y: 1 },
        rotation: 0,
        rotationDelta: player.swordSpeed,
        update() {
          if (this.animate) {
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
        type: 'player',
        x: 10,
        y: this.y - this.size,
        height: 52,
        width: 32,
        animations: spriteSheet.animations
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

      if (kontra.keyPressed("space")) {
        player.hit();
      }
    }.bind(this.playerSprite);
  }
}
