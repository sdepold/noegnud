import Sprite from "kontra/src/sprite";
import { wrap } from "../../misc/helper";
import Weapon from "../player/weapon";

export default function skillBackAttach(player) {
  player.hit = wrap(player.hit, originalFun => {
    if (player.primaryWeapon && player.target) {
      originalFun.call(player);

      const backWeapon = new Weapon(player);
      backWeapon.throw({ x: player.target.x, y: player.target.y });
      backWeapon.sprite.dx *= -1;
      backWeapon.sprite.dy *= -1;
      player.weapons.push(backWeapon);
    }
  });

  return Sprite({ type: "skillBackAttach" });
}

skillBackAttach.limit = 1;
skillBackAttach.type = "skillBackAttach";
skillBackAttach.title = "Backwards Attack"
