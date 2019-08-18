export default class Game {
  constructor() {
    this.layers = {};
  }

  add(entities, layerId = 10) {
    this.layers[layerId] = (this.layers[layerId] || []).concat(entities);
  }

  getSprites(layerFilter = () => true) {
    const layerIds = Object.keys(this.layers).sort().filter(layerFilter);
    const sprites = layerIds.flatMap(layerId => {
      const layer = this.layers[layerId];

      return layer.flatMap(o => o.getSprites());
    });

    return sprites.flat();
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
