import { getCanvas } from "kontra/src/core";
import Sprite from 'kontra/src/sprite'
import SpriteSheet from 'kontra/src/spriteSheet'

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
      animations
    } = {}
  ) {
    super({ level });

    this.healthPoints = this.baseHealth = baseHealth;
    this.attack = attack;
    this.shouldAttack = shouldAttack;
    this.damage = damage;
    this.animations = animations;
  }

  getSprites() {
    return this.weapons.concat(this.getMonsterSprite());
  }

  getMonsterSprite() {
    const monster = this;

    if (!this.sprite) {
      const image = document.querySelector("#chars");
      const spriteSheet = SpriteSheet({
        image: image,
        frameWidth: 16,
        frameHeight: 26,
        animations: this.animations
      });

      const canvas = getCanvas();

      this.sprite = Sprite({
        entity: this,
        type: "monster",
        x: Math.min(20, Math.random() * (canvas.width / 2 - 30)),
        y: Math.min(60, Math.random() * (canvas.height / 2 - 30)),
        dx: Math.random() * 3 - 2,
        dy: Math.random() * 3 - 2,
        height: 26,
        width: 16,
        animations: spriteSheet.animations,
        direction: 'right',

        render(){
          if (this.dx < 0 && this.direction === "right") {
            this.width = -16;
            this.direction = "left";
          } else if (this.dx > 0 && this.direction === "left") {
            this.width = 16;
            this.direction = "right";
          }

          this.draw();
        },

        update() {
          this.advance();

          if (this.targeted) {
            this.shadowColor = "rgba(250, 100, 100, 0.7)";
          } else {
            this.shadowColor = "rgba(0, 0, 0, 0.5)";
          }

          if (this.x < 6 || this.x > canvas.width/2 - 20) {
            this.dx *= -1;
          }

          if (this.y < 16 || this.y > canvas.height/2 - 48) {
            this.dy *= -1;
          }

          if (monster.shouldAttack(monster, this)) {
            monster.attack(monster, this);
          }
        }
      });

      addShadow(this.sprite, { x: -2 });
      addHealth(this, this.sprite, { x: -2, y: 3 });
    }

    return this.sprite;
  }
}

