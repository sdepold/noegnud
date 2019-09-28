import Sprite from "kontra/src/sprite";
import { getCanvas } from "kontra/src/core";

export default class SplashScreen {
  constructor(content, onClick, options) {
    this.content = content;
    this.onClick = onClick;
    this.lines = [];
    this.options = { lineHeight: 20, fontSize: 10, ...options };
    this._hide = false;
  }

  hide() {
    document.querySelector("#controller-disabled").id = "controller";
    this._hide = true;
    canvas.removeEventListener("click", this.onCanvasClick);
  }

  get hidden() {
    return this._hide;
  }

  getSprites() {
    if (this._hide) {
      return [];
    }

    if (!this.sprite) {
      const canvas = getCanvas();
      const splashScreen = this;

      document.querySelector("#controller").id = "controller-disabled";

      this.onCanvasClick = e => {
        const clickY = e.clientY / 2 + splashScreen.options.lineHeight;
        const line = this.lines.find(
          l => l.y < clickY && l.y + splashScreen.options.lineHeight > clickY
        );
        this.onClick(line, e);
      };

      canvas.addEventListener("click", this.onCanvasClick);

      this.sprite = Sprite({
        x: 0,
        y: 0,
        height: canvas.height,
        width: canvas.width,
        opacity: 0,
        render() {
          const content = typeof splashScreen.content === "function"
            ? splashScreen.content()
            : splashScreen.content;

          splashScreen.lines = content.map((line, i) => {
            let y = 50 + i * splashScreen.options.lineHeight;

            if (typeof line === "function") {
              return { y, text: line, options: {} };
            } else {
              const text = [line].flat()[0];
              const options = [line].flat()[1] || {};

              if (options.footer) {
                y = canvas.height / 2 - 30;
              }

              return { y, text, options };
            }
          });

          this.context.save();
          this.context.globalAlpha = this.opacity;
          this.context.fillStyle = "black";
          this.context.fillRect(this.x, this.y, this.width, this.height);

          splashScreen.lines.forEach(({ y, text, options = {} }) => {
            const fontSize = options.fontSize || splashScreen.options.fontSize;

            this.context.font = `${fontSize}px Marker Felt`;
            this.context.fillStyle = options.color || "white";
            this.context.textAlign = options.textAlign || "center";

            if (typeof text === "function") {
              text.call(this, this.context, canvas, { y });
            } else {
              this.context.fillText(text, this.width / 4, y);

              if (options.underline) {
                const textWidth = this.context.measureText(text).width;

                this.context.fillRect(
                  this.width / 4 - textWidth / 2,
                  y + 2,
                  textWidth,
                  2
                );
              }
            }
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

function levelTransitionIntro(player, level) {
  const shadow = player.skills.find(s => s.type === "shadow");

  return [
    [`You finished level ${level.difficulty}!`, { fontSize: 14 }],
    "",
    ["Current player stats", { underline: true }],
    `❤ ${player.healthPoints} / ${player.baseHealth}`,
    `🔪 ${player.d}` + (shadow ? ` + ${shadow.d}` : "")
  ];
}

export function getPauseScreen(player, level, onClick) {
  const needSkillRemoval = level.difficulty % 2 === 1;
  const shadow = player.skills.find(s => s.type === "shadow");
  const removalMessage = "Remove skill and resume run!";
  const keepMessage = "You can keep all skills this round!";
  const messages = levelTransitionIntro(player, level)
    .concat(["", ["Player skills", { underline: true }]])
    .concat(player.skills.map(s => s.title))
    .concat([
      [needSkillRemoval ? removalMessage : keepMessage, { footer: true }]
    ]);

  return new SplashScreen(messages, line => {
    const skill = line && player.skills.find(s => s.title === line.text);

    if (!needSkillRemoval) {
      return onClick();
    }

    if (skill) {
      skill.undo && skill.undo();
      player.skills = player.skills.filter(s => s !== skill);
      onClick();
    }
  });
}

export function getEndScreen() {
  return new SplashScreen(
    [
      "Oh noez :(",
      "",
      ["You died!", { fontSize: 20 }],
      ["Press to restart!", { footer: true }]
    ],
    () => {
      document.location.reload();
    }
  );
}

export function getWinnerScreen(level, player) {
  return new SplashScreen(
    levelTransitionIntro(player, level)
      .concat(
        [
          "",
          "",
          ["Congratulations!", { fontSize: 20 }],
          "You won the game!",
          ["Press to restart!", { footer: true }]
        ])
    , () => {
      document.location.reload();
    });
}
