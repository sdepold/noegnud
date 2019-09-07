import { init, getContext, getCanvas } from "kontra/src/core";
import GameLoop from "kontra/src/gameLoop";

import Player from "./entities/player";
import Game from "./game";
import { setCanvasSize, collides } from "./misc/helper";
import Level from "./entities/level";
import VirtualStick from "virtual-stick";
import ProgressBar from "./progress-bar";
import Ladder from "./entities/ladder";
import Intro from "./intro";
import Text from "./misc/text";
import PauseScreen from "./pause-screen";
import EndScreen from "./end-screen";

export default function initGame() {
  const { width, height } = setCanvasSize();
  const game = new Game();
  const controller = new VirtualStick({
    container: document.querySelector("#controller"),
    "button-size": 40,
    "track-size": 80,
    "track-color": "#72d6ce99",
    "track-stroke-color": "#222222"
  });
  let player, tileEngine, level, pauseScreen;
  const progressBar = new ProgressBar(document.querySelectorAll("img"), () => {
    player = new Player(game, controller);
    level = new Level(width, height);
    tileEngine = level.getSprites()[0];
    pauseScreen = new PauseScreen(player, level, controller);

    setCanvasSize(tileEngine.mapwidth * 2, tileEngine.mapheight * 2);

    game.loaded = true;
    game.remove(progressBar);
    game.add(level, 0);
    game.add(player, 2);
    game.add(level.getMonsters(player));
    game.add(pauseScreen, 11);
  });

  init();
  game.add(progressBar);

  var loop = GameLoop({
    update() {
      const sprites = game.getSprites();
      const monsters = sprites.filter(s => s.type === "monster");
      const playerSprite = sprites.filter(s => s.type === "player")[0];
      const shields = sprites.filter(s => s.type === "shield");
      const canvas = getCanvas();
      let ladder;

      if (
        game.loaded &&
        !monsters.length &&
        !sprites.find(s => s.type === "ladder")
      ) {
        ladder = new Ladder();
        game.add(ladder, 1);
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
        } else if (sprite.type === "monsterWeapon") {
          if (collides(playerSprite, sprite)) {
            player.healthPoints -= sprite.monster.damage;

            if (player.healthPoints <= 0) {
              playerSprite.ttl = 0;
            }
            sprite.ttl = 0;
          } else if (shields.find(shield => collides(sprite, shield))) {
            sprite.ttl = 0;
          }
        } else if (sprite === playerSprite) {
          monsters.forEach(monster => {
            if (
              collides(monster, sprite) &&
              new Date() - (monster.lastCollisionAt || 0) > 1000
            ) {
              monster.lastCollisionAt = new Date();
              player.healthPoints -= monster.entity.damage;

              if (player.healthPoints <= 0) {
                playerSprite.ttl = 0;
                game.add(new EndScreen(), 11);
              }
            }
          });
        } else if (
          sprite.type === "ladder" &&
          collides(playerSprite, sprite) &&
          !player.climbing
        ) {
          player.climb(sprite);
          document.querySelector("#controller").id = "controller-disabled";
          pauseScreen.show(() => {
            document.querySelector("#controller-disabled").id = "controller";
            player.resetClimb();
            level.difficulty--;
            level.reset();
            game.layers[1] = game.layers[10] = [];
            game.add(level.getMonsters(player));
          });
        }

        sprite.update && sprite.update();
      });
    },
    render() {
      const ctx = getContext();
      const sprites = game.getSprites();

      sprites.forEach(s => {
        ctx.save();
        ctx.scale(2, 2);
        s.render();
        ctx.restore();
      });
      controller.draw();
    }
  });

  loop.start();
}
