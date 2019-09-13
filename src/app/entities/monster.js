import { getCanvas } from "kontra/src/core";
import Sprite from "kontra/src/sprite";
import SpriteSheet from "kontra/src/spriteSheet";

import { addShadow } from "../misc/shadow";
import { addHealth } from "../misc/health";
import Base from "./base";

export default class Monster extends Base {
  constructor(
    {
      level = 10,
      attack = () => {},
      shouldAttack = () => false,
      baseHealth,
      damage,
      dx = Math.random() * 3 - 2,
      dy = Math.random() * 3 - 2,
      update = function() {},
      walk,
      ouch
    } = {}
  ) {
    super({ level });

    this.healthPoints = this.baseHealth = baseHealth;
    this.attack = attack;
    this.shouldAttack = shouldAttack;
    this.d = damage;
    this.dx = dx;
    this.dy = dy;
    this.optionalUpdate = update;
    this.walkFrames=walk;
    this.ouchFrames = ouch;
  }

  gS() {
    return this.weapons.concat(this.getMonsterSprite());
  }

  getMonsterSprite() {
    const monster = this;

    if (!this.sprite) {
      const image = document.querySelector("#c");
      const spriteSheet = SpriteSheet({
        image: image,
        frameWidth: 16,
        frameHeight: 26,
        animations: {
          walk: {
            frames: this.walkFrames,
            frameRate: 8
          },
          ouch: {
            frames: this.ouchFrames,
            frameRate: 1
          }
        }
      });

      const canvas = getCanvas();

      this.sprite = Sprite({
        entity: this,
        type: "m",
        x: Math.min(30, Math.random() * (canvas.width / 2 - 30)),
        y: Math.max(30, Math.random() * (canvas.height / 2 - 60)),
        dx: this.dx,
        dy: this.dy,
        height: 26,
        width: 16,
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
          if (!this.hidden) {
            this.draw();
          }
        },

        update() {
          this.advance();
          monster.optionalUpdate.call(this);

          if (this.targeted) {
            this.shadowColor = "rgba(250, 100, 100, 0.7)";
          } else {
            this.shadowColor = "rgba(0, 0, 0, 0.5)";
          }

          if (this.x < 6 || this.x > canvas.width / 2 - 20) {
            this.dx *= -1;
          }

          if (this.y < 16 || this.y > canvas.height / 2 - 48) {
            this.dy *= -1;
          }

          if (monster.shouldAttack(monster, this)) {
            monster.attack(monster, this);
          }
        }
      });

      addShadow(this.sprite, { x: 0 });
      addHealth(this, this.sprite, { x: -2, y: 3 });
    }

    return this.sprite;
  }
}
