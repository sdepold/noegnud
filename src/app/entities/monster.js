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
      damage
    } = {}
  ) {
    super({ level });

    this.healthPoints = this.baseHealth = baseHealth;
    this.attack = attack;
    this.shouldAttack = shouldAttack;
    this.damage = damage;
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
        animations: {
          walk: {
            frames: "5..8",
            frameRate: 8
          },
          ouch: {
            frames: "9..9",
            frameRate: 1
          }
        }
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

export const skullFace = () => {
  const weaponSheet = kontra.SpriteSheet({
    image: document.querySelector("#weapons"),
    frameWidth: 8,
    frameHeight: 19,
    animations: {
      weapon: {
        frames: "1..1",
        frameRate: 1
      }
    }
  });

  return new Monster({
    baseHealth: 500,
    damage: 100,
    shouldAttack: monster => {
      const result = monster.attackAt && monster.attackAt < ~~new Date();

      if (!monster.attackAt || monster.attackAt < ~~new Date()) {
        monster.attackAt = ~~new Date() + 5000;
      }

      return result;
    },

    attack: (monster, sprite) => {
      const weaponDefaults = {
        monster,
        type: "monsterWeapon",
        x: sprite.x - 5,
        y: sprite.y + sprite.height / 2 + 10,
        dx: -2,
        height: 19,
        width: 8,
        animations: weaponSheet.animations,
        anchor: { x: 0.5, y: 0.5 },
        rotation: 0,
        rotationDelta: 1,
        update() {
          this.advance();
          this.rotation = this.rotation + 0.3;
        }
      };

      monster.weapons.push(kontra.Sprite({ ...weaponDefaults }));
      monster.weapons.push(
        kontra.Sprite({ ...weaponDefaults, dx: 2, x: sprite.x + sprite.width })
      );
      monster.weapons.push(
        kontra.Sprite({
          ...weaponDefaults,
          dx: 0,
          dy: -2,
          x: sprite.x + sprite.width / 2 - 5,
          y: sprite.y + 10
        })
      );
      monster.weapons.push(
        kontra.Sprite({
          ...weaponDefaults,
          dx: 0,
          dy: 2,
          x: sprite.x + sprite.width / 2 - 5,
          y: sprite.y + sprite.height + 5
        })
      );
    }
  });
};
