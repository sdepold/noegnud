import kontra from "kontra";
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
      const spriteSheet = kontra.SpriteSheet({
        image: image,
        frameWidth: 16,
        frameHeight: 26,
        animations: this.animations
      });

      const canvas = kontra.getCanvas();

      this.sprite = kontra.Sprite({
        entity: this,
        type: "monster",
        x: Math.random() * (canvas.width - 30),
        y: Math.random() * (canvas.height - 30),
        dx: Math.random() * 3 - 2,
        dy: Math.random() * 3 - 2,
        height: 52,
        width: 32,
        animations: spriteSheet.animations,

        update() {
          this.advance();

          if (this.targeted) {
            this.shadowColor = "rgba(250, 100, 100, 0.7)";
          } else {
            this.shadowColor = "rgba(0, 0, 0, 0.5)";
          }

          if (this.x < 10 || this.x > canvas.width - 32) {
            this.dx *= -1;
          }

          if (this.y < 16 || this.y > canvas.height - 82) {
            this.dy *= -1;
          }

          if (monster.shouldAttack(monster, this)) {
            monster.attack(monster, this);
          }
        }
      });

      addShadow(this.sprite, { x: -5 });
      addHealth(this, this.sprite, { x: -5, y: 10 });
    }

    return this.sprite;
  }
}

