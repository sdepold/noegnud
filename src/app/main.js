import kontra from "kontra";

import Player from "./entities/player";
import skullFace from "./entities/monster/skull-face";
import Game from "./game";
import { setCanvasSize, log, collides, resizeImage } from "./misc/helper";
import Level from "./entities/level";
import VirtualStick from "virtual-stick";
import ProgressBar from "./progress-bar";
import devil from "./entities/monster/devil";

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
  let player, observeMonsters, tileEngine;
  const progressBar = new ProgressBar(document.querySelectorAll("img"), () => {
    player = new Player(game, controller);
    const level = new Level(width, height);
    tileEngine = level.getSprites()[0];
    setCanvasSize(tileEngine.mapwidth, tileEngine.mapheight);

    game.remove(progressBar);
    // game.add(level, 0);
    game.add(player);
    game.add(skullFace(player));
    game.add(skullFace(player));
    game.add(skullFace(player));
    game.add(devil(player));

    observeMonsters = true;
  });

  kontra.init();
  kontra.initKeys();
  game.add(progressBar);

  var loop = kontra.GameLoop({
    update() {
      const sprites = game.getSprites(layerId => layerId !== "0");
      const monsters = sprites.filter(s => s.type === "monster");
      const playerSprite = sprites.filter(s => s.type === "player")[0];

      if (observeMonsters && monsters.length === 0) {
        loop.stop();
        return;
      }

      sprites.forEach(sprite => {
        if (sprite.type === "weapon" && sprite.entity.animate) {
          monsters.forEach(monster => {
            if (collides(monster, sprite)) {
              monster.entity.healthPoints -= player.damage;
              if (monster.entity.healthPoints <= 0) {
                monster.ttl = 0;
                player.resetTarget();
              }
              sprite.ttl = 0;
            }
          });
        } else if (
          sprite.type === "monsterWeapon" && collides(playerSprite, sprite)
        ) {
          player.healthPoints -= sprite.monster.damage;

          if (player.healthPoints <= 0) {
            playerSprite.ttl = 0;
          }
          sprite.ttl = 0;
        }

        sprite.update();
      });
    },
    render() {
      const sprites = game.getSprites();

      tileEngine && tileEngine.render();
      sprites.forEach(s => s.render());
      controller.draw();
    }
  });

  loop.start();
})();
