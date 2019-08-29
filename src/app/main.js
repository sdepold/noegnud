import { init, getContext, getCanvas } from "kontra/src/core";
import GameLoop from "kontra/src/gameLoop";

import Player from "./entities/player";
import Game from "./game";
import { setCanvasSize, collides } from "./misc/helper";
import Level from "./entities/level";
import VirtualStick from "virtual-stick";
import ProgressBar from "./progress-bar";
import Ladder from "./entities/ladder";

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
  let player, tileEngine, level;
  const progressBar = new ProgressBar(document.querySelectorAll("img"), () => {
    player = new Player(game, controller);
    level = new Level(width, height);
    tileEngine = level.getSprites()[0];

    setCanvasSize(tileEngine.mapwidth * 2, tileEngine.mapheight * 2);

    game.loaded = true;
    game.remove(progressBar);
    game.add(level, 0);
    game.add(player, 1);
    game.add(level.getMonsters(player));
  });

  init();
  game.add(progressBar);

  var loop = GameLoop({
    update() {
      const sprites = game.getSprites();
      const monsters = sprites.filter(s => s.type === "monster");
      const playerSprite = sprites.filter(s => s.type === "player")[0];
      const canvas = getCanvas();

      if (
        game.loaded &&
        !monsters.length &&
        !sprites.find(s => s.type === "ladder")
      ) {
        game.add(new Ladder());
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
        } else if (sprite.type === "ladder" && collides(playerSprite, sprite)) {
          playerSprite.x = canvas.width / 4 - 16;
          playerSprite.y = ~~(canvas.height / 2 * 0.75);
          level.difficulty--
          game.layers[10] = [];
          game.add(level.getMonsters(player));
        }

        sprite.update && sprite.update();
      });
    },
    render() {
      const ctx = getContext();
      const sprites = game.getSprites();

      ctx.save();
      ctx.scale(2, 2);

      sprites.forEach(s => s.render());
      controller.draw();

      ctx.restore();
    }
  });

  loop.start();
})();
