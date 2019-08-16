import Platform from "./platform";

export default class Level {
  constructor() {
    this.platforms = [];

    this.generate(10, 10);
  }

  generate(x, todo) {
    console.log({x, todo})
    const width = ~~(Math.random() * 500);
    const height = ~~(Math.random() * 500);
    const y = ~~(Math.random() * 500);
    const platform = new Platform(x, y, width, height)
    const newX = x + platform.width + Math.max(20, ~~(Math.random() * 50));

    this.platforms.push(platform);

    if (todo > 0) {
      this.generate(newX, todo - 1);
    }
  }
}
