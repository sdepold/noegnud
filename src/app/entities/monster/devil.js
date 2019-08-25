import kontra from 'kontra';
import Monster from '../monster';
import { getDirection } from '../../misc/helper';

export default function devil(player) {
  const weaponSheet = kontra.SpriteSheet({
    image: document.querySelector("#weapons"),
    frameWidth: 8,
    frameHeight: 19,
    animations: {
      weapon: {
        frames: "2..2",
        frameRate: 1
      }
    }
  });

  return new Monster({
    baseHealth: 250,
    damage: 400,

    animations: {
      walk: {
        frames: "10..13",
        frameRate: 8
      },
      ouch: {
        frames: "14..14",
        frameRate: 1
      }
    },

    shouldAttack: monster => {
      const result = monster.attackAt && monster.attackAt < ~~new Date();

      if (!monster.attackAt || monster.attackAt < ~~new Date()) {
        monster.attackAt = ~~new Date() + 5000;
      }

      return result;
    },

    attack: (monster, sprite) => {
      const {dx, dy, angle} = getDirection(5, monster.sprite, player.playerSprite);

      monster.weapons.push(kontra.Sprite({
        monster,
        type: "monsterWeapon",
        x: sprite.x - 5,
        y: sprite.y + sprite.height / 2 + 10,
        dx,
        dy,
        rotation: angle + 1.5,
        height: 19*2,
        width: 8*2,
        animations: weaponSheet.animations,
        anchor: { x: 0.5, y: 0.5 }
      }));
    }
  });
}
