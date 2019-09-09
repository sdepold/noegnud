import { init, getContext } from "kontra/src/core";
import GameLoop from "kontra/src/gameLoop";

import { initAudio } from "./audio";
import Player from "./entities/player";
import Game from "./game";
import { setCanvasSize, collides } from "./misc/helper";
import Level from "./entities/level";
import VirtualStick from "virtual-stick";
import ProgressBar from "./progress-bar";
import Ladder from "./entities/ladder";
import SplashScreen, { getPauseScreen, getEndScreen } from "./splash-screen";
import TombStone from "./tombstone";

const { width, height } = setCanvasSize();
const game = new Game();
const controller = new VirtualStick({
  container: document.querySelector("#controller"),
  "button-size": 40,
  "track-size": 80,
  "track-color": "#72d6ce99",
  "track-stroke-color": "#222222"
});
let player, tileEngine, level, startScreen;
const progressBar = new ProgressBar(document.querySelectorAll("img"), () => {
  player = new Player(game, controller);
  level = new Level(width, height);
  tileEngine = level.getSprites()[0];

  setCanvasSize(tileEngine.mapwidth * 2, tileEngine.mapheight * 2);
  game.loaded = true;
  game.remove(progressBar);

  startScreen = new SplashScreen(
    [
      "Welcome to the",
      (() => {
        let text = "NOEGNUD";
        let lastShuffle = new Date();
        let delta = 2000;

        return function(ctx, canvas, line) {
          if (new Date() - lastShuffle > delta) {
            text = text
              .split("")
              .sort(() => (Math.random() > 0.5 ? -1 : 1))
              .join("");
            if (Math.random() < 0.2) {
              text = "DUNGEON";
            } else if (Math.random() > 0.8) {
              text = "NOEGNUD";
            }
            lastShuffle = new Date();
            delta = 250;
          }

          ctx.fillText(text, this.width / 4, line.y);
        };
      })(),
      ["Touch to start!", { footer: true, fontSize: 10 }]
    ],
    () => {
      const initGame = () => {
        startScreen.hide();
        game.add(level.getMonsters(player));
      };
      initAudio().then(initGame, initGame);
    },
    {
      fontSize: 14,
      lineHeight: 30
    }
  );

  game.add(startScreen, 12);
  game.add(level, 0);
  game.add(player, 2);
});

init();
game.add(progressBar);

var loop = GameLoop({
  update() {
    const sprites = game.getSprites();
    const monsters = sprites.filter(s => s.type === "monster");
    const playerSprite = sprites.filter(s => s.type === "player")[0];
    const shields = sprites.filter(s => s.type === "shield");
    let ladder;

    function hurtPlayer(player, enemy, sprites) {
      player.healthPoints -= enemy.damage;

      if (player.healthPoints <= 0) {
        sprites
          .filter(s =>
            ["player", "shadow", "weapon", "shield"].includes(s.type)
          )
          .forEach(s => s.ttl = 0);
        game.add(new TombStone(playerSprite));
        game.add(getEndScreen(player), 11);
      }
    }

    if (
      game.loaded &&
      startScreen.hidden &&
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
              game.add(new TombStone(monster));
              player.resetTarget();
            }
            sprite.ttl = 0;
          }
        });
      } else if (sprite.type === "monsterWeapon") {
        if (collides(playerSprite, sprite)) {
          hurtPlayer(player, sprite.monster, sprites);

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
            hurtPlayer(player, monster.entity, sprites);
          }
        });
      } else if (
        sprite.type === "ladder" &&
        collides(playerSprite, sprite) &&
        !player.climbing
      ) {
        player.climb(sprite);

        const pauseScreen = getPauseScreen(player, level, () => {
          pauseScreen.hide();
          player.resetClimb();
          level.difficulty--;
          level.reset();
          game.layers[1] = game.layers[10] = [];
          game.add(level.getMonsters(player));
        });

        game.add(pauseScreen);
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
