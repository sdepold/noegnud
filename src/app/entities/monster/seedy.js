import Sprite from "kontra/src/sprite";
import SpriteSheet from "kontra/src/spriteSheet";
import Monster from "../monster";
import { getDirection } from "../../misc/helper";

export default function devil(player) {
  let lastTeleportedAt = new Date();

  return new Monster({
    baseHealth: 1250,
    damage: 25,

    animations: {
      walk: {
        frames: "15..18",
        frameRate: 8
      },
      ouch: {
        frames: "19..19",
        frameRate: 1
      }
    },

    update() {
      if (new Date() - (lastTeleportedAt || 0) > 5000) {
        this.hidden = true;
        setTimeout(() => {
          this.hidden = false;
        }, 2000);
        lastTeleportedAt = new Date();
      }
    },

    shouldAttack: monster => {
      const result = monster.attackAt && monster.attackAt < ~~new Date();

      if (!monster.attackAt || monster.attackAt < ~~new Date()) {
        monster.attackAt = ~~new Date() + 2000;
      }

      return result;
    },

    attack: (monster, sprite) => {
      const { dx, dy, angle } = getDirection(
        5,
        monster.sprite,
        player.playerSprite
      );

      monster.weapons.push(
        Sprite({
          monster,
          type: "monsterWeapon",
          x: sprite.x - 5,
          y: sprite.y + sprite.height / 2 + 10,
          dx,
          dy,
          rotation: angle + 1.5,
          height: 19,
          width: 8,
          anchor: { x: 0.5, y: 0.5 },
          render() {
            this.context.save();
            this.context.shadowColor = "#000";
            this.context.shadowBlur = 10;
            this.context.fillStyle = "#97da3f";
            this.context.fillRect(this.x, this.y, 3, 3);
            this.context.restore();
          }
        })
      );

      zzfx(.5, .1, 1059, .1, .52, 5.4, 1.5, 43.1, .79); // ZzFX 30517
    }
  });
}
