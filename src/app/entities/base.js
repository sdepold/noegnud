export default class Base {
  constructor({ level = 10 } = {}) {
    this.level = level;
    this.weapons = [];
  }
  get health() {
    return ~~(this.healthPoints / this.baseHealth * 100);
  }
}
