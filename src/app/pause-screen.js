import Sprite from "kontra/src/sprite";
import { getCanvas } from "kontra/src/core";

let lines = [];
let lineHeight = 20;

function formatSkill(s) {
  return ` -  ${s.title}`
}

export default class PauseScreen {
  constructor(player, level, controller) {
    this.player = player;
    this.level = level;
    this.controller = controller;
  }

  show(onDone) {
    this.onDone = onDone;
    this.showing = true;
  }

  getSprites() {
    const pauseScreen = this;
    const player = this.player;
    const level = this.level;

    if (!this.showing) {
      return [];
    }

    if (!this.sprite) {
      getCanvas().addEventListener("click", e => {
        const clickY = e.clientY / 2 + lineHeight;
        const line = lines.find(
          l => l.y < clickY && l.y + lineHeight > clickY
        );
        const skill = line && this.player.skills.find(s => formatSkill(s) === line.text)
        if (skill) {
          skill.undo && skill.undo();
          this.player.skills = this.player.skills.filter(s => s !== skill);
          this.showing = false;
          this.onDone();
        }
      });

      const canvas = getCanvas();
      this.sprite = Sprite({
        x: 0,
        y: 0,
        height: canvas.height,
        width: canvas.width,
        opacity: 0,
        render() {
          lines = [];
          this.context.save();

          this.context.globalAlpha = this.opacity;
          this.context.fillStyle = "black";
          this.context.fillRect(this.x, this.y, this.width, this.height);
          this.context.font = "10px Marker Felt";
          this.context.fillStyle = "white";
          const content = [
            `Level: ${level.difficulty}`,
            "",
            "Player stats:",
            ` -  Health: ${player.healthPoints} / ${player.baseHealth}`,
            ` -  Damage: ${player.damage}`,
            "",
            `Skills:`
          ]
            .concat(player.skills.map(formatSkill))
            .concat([
              "",
              "Click on skill to remove it.",
              "Game will continue afterwards."
            ]);

          content.forEach((line, i) => {
            this.context.fillText(line, 10, 50 + i * lineHeight);
            lines.push({
              y: 50 + i * lineHeight,
              text: line
            });
          });
          this.context.restore();
        },
        update() {
          this.advance();
          if (this.opacity < 0.75) {
            this.opacity += 0.02;
          }
        }
      });
    }

    return [this.sprite];
  }
}
