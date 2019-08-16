import kontra from "kontra";
// import Platform from "./entities/platform";
import Player from "./entities/player";
import Monster from "./entities/monster";
import Game from "./game";
// import Level from "./entities/level";
import { setCanvasSize } from "./helper";

(async () => {
  setCanvasSize();

  const game = new Game();
  // const level = new Level();

  kontra.init();
  kontra.initKeys();

  // level.platforms.forEach(p => game.add(p));
  game.add(new Player(game));
  game.add(new Monster());
  game.add(new Monster());
  game.add(new Monster());

  var loop = kontra.GameLoop({
    update() {
      let canvas = kontra.getCanvas();

      game.entities.forEach(async entity => {
        const sprites = await entity.getSprites();
        sprites.forEach(sprite => {
          sprite.update();

          if (sprite.x < 0) {
            sprite.x = canvas.width;
          }
          // sprite is beyond the right edge
          else if (sprite.x > canvas.width) {
            sprite.x = 0;
          }
          // sprite is beyond the top edge
          if (sprite.y < 0) {
            sprite.y = canvas.height;
          }
          // sprite is beyond the bottom edge
          else if (sprite.y > canvas.height) {
            sprite.y = 0;
          }

        });
      });
    },
    render() {
      game.entities.forEach(async entity => {
        const sprites = await entity.getSprites();
        sprites.forEach(s => s.render());
      });
    }
  });

  loop.start();
})();
