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
import Sprite from 'kontra/src/sprite';
import SplashScreen, {
  getPauseScreen,
  getEndScreen,
  getWinnerScreen
} from "./splash-screen";
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
const gameTitle = "NOEGNUD";

function renderDamage({ x, y }, damage) {
  const colors = ["#44D9CF", "#30718C", "#EC402B", "#B1CCD0", "#FDE700", "#FF7B00"];
  const color = colors[~~(Math.random() * colors.length)];

  const sprite = Sprite({
    x,
    y,
    dx: Math.random() * 3 - 1.5,
    dy: Math.random() * 3 - 1.5,
    fontSize: 10,
    opacity: 1,
    render() {
      this.context.save()
      this.context.globalAlpha = this.opacity;
      this.context.font = `${this.fontSize}px Marker Felt`;
      this.context.fillStyle = color;
      this.context.fillText(damage, this.x, this.y);
      this.context.restore();
    },
    update() {
      this.advance();
      this.opacity -= .01;
      this.fontSize -= .1;
      if (this.opacity < .25) {
        this.ttl = 0;
      }
    }
  });
  game.add({ gS() { return [sprite] } });
}

let player, tileEngine, level, startScreen;
const progressBar = new ProgressBar(document.querySelectorAll("img"), () => {
  player = new Player(game, controller);
  level = new Level(width, height);
  tileEngine = level.gS()[0];

  setCanvasSize(tileEngine.mapwidth * 2, tileEngine.mapheight * 2);
  game.loaded = true;
  game.remove(progressBar);

  startScreen = new SplashScreen(
    [
      "Welcome to the",
      (() => {
        let text = gameTitle;
        let lastShuffle = new Date();
        let delta = 2000;

        return function (ctx, canvas, line) {
          if (new Date() - lastShuffle > delta) {
            text = text
              .split("")
              .sort(() => (Math.random() > .5 ? -1 : 1))
              .join("");
            if (Math.random() < .2) {
              text = "DUNGEON";
            } else if (Math.random() > .8) {
              text = gameTitle;
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
    const sprites = game.gS();
    const monsters = sprites.filter(s => s.type === "m");
    const playerSprite = sprites.filter(s => s.type === "p")[0];
    const shields = sprites.filter(s => s.type === "a");
    let ladder;

    function hurtPlayer(player, enemy, sprites) {
      player.healthPoints -= enemy.damage;
      renderDamage(player, enemy.damage);

      if (player.healthPoints <= 0) {
        sprites
          .filter(s =>
            ["p", "x", "w", "a"].includes(s.type)
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
      !sprites.find(s => s.type === "l")
    ) {
      ladder = new Ladder();
      game.add(ladder, 1);
    }

    sprites.forEach(sprite => {
      if (sprite.type === "w" && sprite.entity.animate) {
        monsters.forEach(monster => {
          if (collides(monster, sprite)) {
            zzfx(.3, .1, 94, .1, .14, 0, 0, 5, .29); // ZzFX 39966
            monster.entity.healthPoints -= player.damage;
            renderDamage(monster, player.damage);

            if (monster.entity.healthPoints <= 0) {
              monster.ttl = 0;
              game.add(new TombStone(monster));
              player.resetTarget();
            }
            sprite.ttl = 0;
          }
        });
      } else if (sprite.type === "mw") {
        if (collides(playerSprite, sprite)) {
          hurtPlayer(player, sprite.monster, sprites);

          sprite.ttl = 0;
        } else if (shields.find(shield => collides(sprite, shield))) {
          sprite.ttl = 0;
          zzfx(1, .1, 327, .1, .08, 7.4, .2, 5.9, .49); // ZzFX 88235
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
        sprite.type === "l" &&
        collides(playerSprite, sprite) &&
        !player._c
      ) {
        player.climb(sprite);

        let screen;

        if (level.difficulty === 1) {
          screen = getWinnerScreen();
        } else {
          screen = getPauseScreen(player, level, () => {
            screen.hide();
            player.resetClimb();
            level.difficulty--;
            level.reset();
            game.layers[1] = game.layers[10] = [];
            game.add(level.getMonsters(player));
          });
        }

        game.add(screen);
      }

      sprite.update && sprite.update();
    });
  },
  render() {
    const ctx = getContext();
    const sprites = game.gS();

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
