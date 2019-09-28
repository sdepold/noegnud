import Player from "../player";
import { wrap } from "../../misc/helper";

export default function skillShadow(player) {
  const playerSprite = player.getPlayerSprite();
  const shadow = new Player(player.game, player.controller, []);
  const shadowSprite = shadow.getPlayerSprite();

  syncPosition(shadowSprite, playerSprite);

  shadow.d *= .25;
  shadow.type = shadowSprite.type = "shadow";
  shadowSprite.render = wrap(shadowSprite.render, render => {
    shadowSprite.context.save();
    shadowSprite.context.globalAlpha = .5;
    render.call(shadowSprite);
    shadowSprite.context.restore();
  });

  shadowSprite.update = function () {
    this.advance();

    if (shadow.primaryWeapon) {
      shadow.primaryWeapon.syncPosition(this);
      shadow.primaryWeapon.sprite.render = function () {
        this.context.save();
        this.context.globalAlpha = .5;
        this.draw();
        this.context.restore();
      }.bind(shadow.primaryWeapon.sprite);
    }

    this.dx = playerSprite.dx;
    this.x = playerSprite.x + 40;
    this.y = playerSprite.y + 40;
  }.bind(shadowSprite);

  player.onHit = function () {
    shadow.target = player.target;
    shadow.hit();
  };

  return shadow;
}

function syncPosition(shadowSprite, playerSprite) {
  shadowSprite.prevX = shadowSprite.x;
  shadowSprite.x = playerSprite.x;
  shadowSprite.y = playerSprite.y;
}

skillShadow.title = "Shadow";
skillShadow.type = "shadow";
skillShadow.limit = 1;
