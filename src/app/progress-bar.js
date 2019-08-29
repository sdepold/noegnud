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
    this.assets.forEach(asset => {
      if (asset.complete) {
        markLoaded(asset);
      } else {
        asset.onload = () => {
          markLoaded(asset);
        };
      }
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
    return [];
  }
}
