import { getCanvas } from "kontra/src/core";
import Sprite from "kontra/src/sprite";
import SpriteSheet from "kontra/src/spriteSheet";

import { getSkills } from "./skill";
import { addKeyboardControls, addMouseControls } from "./player/controls";
import Weapon from "./player/weapon";
import { addShadow } from "../misc/shadow";
import { addHealth } from "../misc/health";
import Base from "./base";

export default class Player extends Base {
  constructor(game, controller, skills) {
    super();

    const canvas = getCanvas();

    this.healthPoints = this.baseHealth = this.level * 100;
    this.game = game;
    this.controller = controller;
    this.y = ~~(canvas.height / 2 * 0.75);
    this._power = 10;
    this.powerBuff = 0;
    this._swordSpeed = 0.3;
    this.swordSpeedBuff = 0;
    this.charSpeedBuff = 0;
    this.skills = skills || getSkills(this, 4);
    this.weapons = [new Weapon(this)];
    this.target = null;
    this.damage = 50;
  }

  climb(ladder, callback) {
    const originalUpdate = this.playerSprite.update.bind(this.playerSprite);
    const canvas = getCanvas();
    const player = this;

    this.climbing = true;
    this.playerSprite.x = ladder.x - 5;
    this.playerSprite.y = ladder.y + ladder.height;
    this.playerSprite.dy = -1;
    this.playerSprite.dx = 0;

    this.playerSprite.update = function() {
      this.advance();

      if (this.y < ladder.y - ladder.height - 5) {
        this.update = originalUpdate;
        player.climbing = false;
        this.x = canvas.width / 4 - 16;
        this.y = ~~(canvas.height / 2 * 0.75);
        callback();
      }

      player.primaryWeapon && player.primaryWeapon.syncPosition(this);
    }.bind(this.playerSprite);
  }

  get isMoving() {
    const sprite = this.getPlayerSprite();

    return (
      (sprite.prevX || sprite.x) !== sprite.x ||
      (sprite.prevY || sprite.y) !== sprite.y
    );
  }

  get swordSpeed() {
    return this._swordSpeed + this.swordSpeedBuff;
  }

  get power() {
    return this._power + this.powerBuff;
  }

  getSprites() {
    const weaponSprites = this.weapons.flatMap(weapon => weapon.getSprites());
    const skillSprites = this.skills.flatMap(
      skill => (skill.getSprites ? skill.getSprites() : skill)
    );

    const allSprites = skillSprites
      .filter(s => !!s)
      .concat(this.getPlayerSprite())
      .concat(weaponSprites);

    return allSprites;
  }

  hit() {
    if (this.primaryWeapon && this.target) {
      this.onHit && this.onHit();
      this.primaryWeapon.throw({ x: this.target.x, y: this.target.y });
      setTimeout(() => {
        this.weapons.push(new Weapon(this));
      }, 500);
    }
  }

  resetTarget() {
    if (this.target) {
      this.target.targeted = false;
    }

    this.target = null;
  }

  setTarget(target) {
    this.target = this.target || target;
    this.target.targeted = true;
  }

  getPlayerSprite() {
    if (!this.playerSprite) {
      const canvas = getCanvas();
      const image = document.querySelector("#chars");
      const spriteSheet = SpriteSheet({
        image: image,
        frameWidth: 16,
        frameHeight: 26,
        animations: {
          walk: {
            frames: "0..3",
            frameRate: 8
          },
          ouch: {
            frames: "4..4",
            frameRate: 1
          }
        }
      });

      this.playerSprite = Sprite({
        entity: this,
        type: "player",
        x: canvas.width / 4 - 16,
        y: this.y,
        width: 16,
        height: 26,
        animations: spriteSheet.animations,
        direction: "left" /*,
        render() {
          this.context.save();

          if (this.direction === 'left') {
            // this.context.translate(
            //   this.x + this.width / 2,
            //   this.y + this.height / 2
            // );
            this.context.scale(-1, 1);
          }

          this.__proto__.render.call(this);
          this.context.restore();

        }*/
      });

      addShadow(this.playerSprite);
      addHealth(this, this.playerSprite);
      addKeyboardControls(this);
      addMouseControls(this);
    }

    return this.playerSprite;
  }

  get primaryWeapon() {
    return this.weapons.find(w => !w.animate);
  }
}
