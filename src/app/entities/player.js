import kontra from "kontra";
import generateSkills from "../misc/skill-generator";
import { addKeyboardControls, addMouseControls } from "./player/controls";
import Weapon from "./player/weapon";

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
    this.weapons = [new Weapon(this)];

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

      skillSprite.x = (i + 1) * (skillSprite.width + 10) - 30;

      return acc.concat(skillSprite);
    }, []);
    const weaponSprites = this.weapons.flatMap(weapon => weapon.getSprites());

    const allSprites = skillSprites
      .concat(this.getPlayerSprite())
      .concat(weaponSprites);

    return allSprites;
  }

  hit() {
    if (this.primaryWeapon) {
      this.primaryWeapon.throw();
      setTimeout(() => {
        this.weapons.push(new Weapon(this));
      }, 500);
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
        type: "player",
        x: 10,
        y: this.y - this.size,
        height: 52,
        width: 32,
        animations: spriteSheet.animations
      });

      addKeyboardControls(this);
      addMouseControls(this);
    }

    return this.playerSprite;
  }

  get primaryWeapon() {
    return this.weapons.find(w => !w.animate);
  }
}
