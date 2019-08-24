import kontra from "kontra";

import Player from "./entities/player";
import Monster, {skullMask} from "./entities/monster";
import Game from "./game";
import { setCanvasSize, log } from "./misc/helper";
import Level from "./entities/level";
import VirtualStick from "virtual-stick";
import ProgressBar from "./progress-bar";

(() => {
  const { width, height } = setCanvasSize();
  const game = new Game();
  const controller = new VirtualStick({
    container: document.querySelector("#controller"),
    "button-size": 40,
    "track-size": 80,
    "track-color": "#72d6ce99",
    "track-stroke-color": "#222222"
  });
  let player;
  const progressBar = new ProgressBar(document.querySelectorAll("img"), () => {
    player = new Player(game, controller);
    const level = new Level(width, height);
    const tileEngine = level.getSprites()[0];
    setCanvasSize(tileEngine.mapwidth, tileEngine.mapheight);

    game.remove(progressBar);
    game.add(level, 0);
    game.add(player);
    game.add(skullMask());
    // game.add(new Monster());
    // game.add(new Monster());
  });

  kontra.init();
  kontra.initKeys();
  game.add(progressBar);

  var loop = kontra.GameLoop({
    update() {
      const sprites = game.getSprites(layerId => layerId !== "0");
      const monsters = sprites.filter(s => s.type === "monster");

      sprites.forEach(sprite => {
        if (sprite.type === "weapon") {
          monsters.forEach(monster => {
            const dx = monster.x - sprite.x;
            const dy = monster.y - sprite.y;
            const collision =
              Math.sqrt(dx * dx + dy * dy) < monster.width + sprite.width - 20;

            if (collision) {
              monster.entity.healthPoints -= 100;
              if (monster.entity.healthPoints <= 0) {
                monster.ttl = 0;
                player.resetTarget();
              }
              sprite.ttl = 0;
            }
          });
        }

        sprite.update();
      });
    },
    render() {
      const sprites = game.getSprites();

      sprites.forEach(s => s.render());
      controller.draw();
    }
  });

  loop.start();
})();
