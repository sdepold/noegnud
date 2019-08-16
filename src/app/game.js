export default class Game {
  constructor() {
    this.entities = [];
  }

  add(entities) {
    this.entities = this.entities.concat(entities);
  }

  findCurrentPlatform(playerX) {
    return this.entities.find(entity => {
      return (
        entity.type === "platform" &&
        entity.x <= playerX &&
        entity.x + entity.width >= playerX
      );
    });
  }
}
