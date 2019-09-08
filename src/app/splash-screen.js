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
  }

  getSprites() {
    if (this._hide) {
      return [];
    }

    if (!this.sprite) {
      const canvas = getCanvas();
      const splashScreen = this;

      document.querySelector("#controller").id = "controller-disabled";

      canvas.addEventListener("click", e => {
        const clickY = e.clientY / 2 + splashScreen.options.lineHeight;
        const line = this.lines.find(
          l => l.y < clickY && l.y + splashScreen.options.lineHeight > clickY
        );
        this.onClick(line, e);
      });

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

          splashScreen.lines = content.map((line, i) => ({
            y: 50 + i * splashScreen.options.lineHeight,
            text: line
          }));

          this.context.save();
          this.context.globalAlpha = this.opacity;
          this.context.fillStyle = "black";
          this.context.fillRect(this.x, this.y, this.width, this.height);
          this.context.font = `${splashScreen.options.fontSize}px Marker Felt`;
          this.context.fillStyle = "white";
          this.context.textAlign = "center";

          splashScreen.lines.forEach(line => {
            typeof line.text === "function"
              ? line.text.call(this, this.context, canvas, line)
              : this.context.fillText(line.text, this.width / 4, line.y);
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
