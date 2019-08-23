import kontra from "kontra";

import Player from "./entities/player";
import Monster from "./entities/monster";
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
  const progressBar = new ProgressBar(document.querySelectorAll("img"), () => {
    game.remove(progressBar);
    game.add(new Level(width, height), 0);
    game.add(new Player(game, controller));
    game.add(new Monster());
    game.add(new Monster());
    game.add(new Monster());
  });

  kontra.init();
  kontra.initKeys();
  game.add(progressBar);

  var loop = kontra.GameLoop({
    update() {
      const sprites = game.getSprites(layerId => layerId !== "0");
      const monsters = sprites.filter(s => s.type === 'monster');

      sprites.forEach(sprite => {
        if (sprite.type === 'weapon') {
          monsters.forEach(monster => {
            if (monster.collidesWith(sprite) || sprite.collidesWith(monster)) {
              monster.entity.healthPoints -= 100;
              sprite.ttl = 0;
            }
          })
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
