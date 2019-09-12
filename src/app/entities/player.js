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
    this.y = ~~(canvas.height / 2 * .75);
    this.swordSpeed = 0.3;
    this.skills = skills || getSkills(this, 4);
    this.weapons = [new Weapon(this)];
    this.target = null;
    this.damage = 50;
  }

  climb(ladder) {
    this.originalUpdate = this.playerSprite.update.bind(this.playerSprite);

    const player = this;

    this._c = true;
    this.playerSprite.x = ladder.x - 5;
    this.playerSprite.y = ladder.y + ladder.height;
    this.playerSprite.dy = -1;
    this.playerSprite.dx = 0;

    this.playerSprite.update = function () {
      this.advance();

      if (this.y < ladder.y - ladder.height - 5) {
        this.dy = 0;
      }

      player.primaryWeapon && player.primaryWeapon.syncPosition(this);
    }.bind(this.playerSprite);
  }

  resetClimb() {
    const canvas = getCanvas();

    this._c = false;
    this.playerSprite.update = this.originalUpdate;
    this.playerSprite.x = canvas.width / 4 - 16;
    this.playerSprite.y = ~~(canvas.height / 2 * .75);
  }

  get isMoving() {
    const sprite = this.getPlayerSprite();

    return (
      (sprite.prevX || sprite.x) !== sprite.x ||
      (sprite.prevY || sprite.y) !== sprite.y
    );
  }

  gS() {
    const weaponSprites = this.weapons.flatMap(weapon => weapon.gS());
    const skillSprites = this.skills.flatMap(
      skill => (skill.gS ? skill.gS() : skill)
    );

    const allSprites = skillSprites
      .filter(s => !!s)
      .concat(this.getPlayerSprite())
      .concat(weaponSprites);

    return allSprites;
  }

  hit() {
    if (this.primaryWeapon && this.target && !this.target.hidden) {
      this.onHit && this.onHit();
      zzfx(.3, .1, 1100, .2, .33, .8, 1.5, 0, .05); // ZzFX 13828
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
      const image = document.querySelector("#c");
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
        type: "p",
        x: canvas.width / 4 - 16,
        y: this.y,
        width: 16,
        height: 26,
        animations: spriteSheet.animations,
        direction: "right",
        render() {
          if (this.dx < 0 && this.direction === "right") {
            this.width = -16;
            this.direction = "left";
          } else if (this.dx > 0 && this.direction === "left") {
            this.width = 16;
            this.direction = "right";
          }

          this.draw();
        }
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
