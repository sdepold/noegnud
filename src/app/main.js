import kontra from "kontra";

import Player from "./entities/player";
import Monster from "./entities/monster";
import Game from "./game";
import { setCanvasSize, log } from "./helper";
import Level from "./entities/level";

(() => {
  const { width, height } = setCanvasSize();
  const game = new Game();

  kontra.init();
  kontra.initKeys();

  game.add(new Level(width, height), 0);
  game.add(new Player(game));
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

        sprite.update();
      });
    },
    render() {
      const sprites = game.getSprites();

      sprites.forEach(s => s.render());
    }
  });

  loop.start();
})();
