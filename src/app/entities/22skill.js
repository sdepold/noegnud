import { getImage } from "../misc/helper";
import { SpriteSheet, Sprite } from "kontra";

const skillMap = {
  weaponSpeed: 0,
  power: 1,
  charSpeed: 2
};

export default class Skill {
  constructor(name, icon, effect) {
    this.name = name;
    this.icon = icon;
    this.effect = effect;
  }

  getSprites() {
    if (!this.sprites) {
      const image = document.querySelector("#stats");
      const spriteSheet = SpriteSheet({
        image: image,
        frameWidth: 30,
        frameHeight: 30,
        animations: {
          walk: {
            frames: `${skillMap[this.icon]}..${skillMap[this.icon]}`,
            frameRate: 1000
          }
        }
      });

      this.sprites = [
        Sprite({
          type: "skill",
          x: 10,
          y: 0,
          height: 24,
          width: 24,
          animations: spriteSheet.animations
        })
      ];
    }

    return this.sprites;
  }
}
