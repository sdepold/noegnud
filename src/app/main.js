import kontra from "kontra";

import Player from "./entities/player";
import Monster from "./entities/monster";
import Game from "./game";
import { setCanvasSize, log } from "./misc/helper";
import Level from "./entities/level";
import VirtualStick from 'virtual-stick';

(() => {
  const { width, height } = setCanvasSize();
  const game = new Game();
  let controller = new VirtualStick({
    container: document.querySelector("#controller"),
    'button-size': 40,
    'track-size': 80,
    'track-color':'#72d6ce99',
    'track-stroke-color': '#222222'
  });

  kontra.init();
  kontra.initKeys();

  game.add(new Level(width, height), 0);
  game.add(new Player(game, controller));
  game.add(new Monster());
  game.add(new Monster());
  game.add(new Monster());

  var loop = kontra.GameLoop({
    update() {
      const sprites = game.getSprites(layerId => layerId !== "0");

      sprites.forEach(sprite => {
        if (sprite.type === "tile") {
          return;
        }

        sprite.isAlive() && sprite.update();
      });
    },
    render() {
      const sprites = game.getSprites();

      sprites.forEach(s => s.isAlive() && s.render());
      controller.draw();
    }
  });

  loop.start();
})();
