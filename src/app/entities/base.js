export default class Base {
  constructor({ level = 10 } = {}) {
    this.level = level;
    this.healthPoints = this.baseHealth;
  }
  get health() {
    return ~~(this.healthPoints / this.baseHealth * 100);
  }

  get baseHealth() {
    return 100 * this.level;
  }
}
