import kontra from "kontra";

export default class ProgressBar {
  constructor(assets, callback) {
    this.assets = assets;
    this.loaded = [];
    this.callback = callback;

    this.load();
  }

  load() {
    const markLoaded = asset => {
      this.loaded.push(asset);
      this.verify();
    };
    this.assets.forEach((asset, i) => {
        setTimeout(() => {
            if (asset.complete) {
              markLoaded(asset);
            } else {
              asset.onload = () => {
                markLoaded(asset);
              };
            }
        }, i * 200);
    });
  }

  verify() {
    if (this.loaded.length === this.assets.length) {
      setTimeout(() => {
        this.callback();
      }, 1000);
    }
  }

  getSprites() {
    const canvas = kontra.getCanvas();
    const width = ~~(canvas.width * 0.8);
    const height = 20;
    const border = 2;
    const progressWidth = () =>
      width * (this.loaded.length / this.assets.length) - border * 2;

    if (!this.sprites) {
      this.sprites = [
        kontra.Sprite({
          x: (canvas.width - width) / 2,
          y: canvas.height / 2 - height / 2,
          color: "white",
          width,
          height
        }),
        kontra.Sprite({
          x: (canvas.width - width) / 2 + border,
          y: canvas.height / 2 - height / 2 + border,
          color: "grey",
          width: progressWidth(),
          height: height - border * 2,
          update() {
            this.advance();
            this.width = progressWidth();
          }
        })
      ];
    }

    return this.sprites;
  }
}
