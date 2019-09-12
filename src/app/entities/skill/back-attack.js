import Sprite from "kontra/src/sprite";
import Weapon from "../player/weapon";

export default function skillBackAttach(player) {
  const originalHit = player.hit.bind(player);

  player.hit = () => {
    if (player.primaryWeapon && player.target && !player.target.hidden) {
      originalHit();

      const backWeapon = new Weapon(player);
      backWeapon.throw({ x: player.target.x, y: player.target.y });
      backWeapon.sprite.dx *= -1;
      backWeapon.sprite.dy *= -1;
      player.weapons.push(backWeapon);
    }
  };

  const result = Sprite({ type: "sba" });

  result.undo = () => {
    player.hit = originalHit;
  };

  return result;
}

skillBackAttach.limit = 1;
skillBackAttach.type = "sba";
skillBackAttach.title = "Backwards Attack"
