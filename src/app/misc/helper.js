export function wrap(originalFun, newFun, context) {
  return function() {
    newFun(originalFun);
  };
}

export function getImage(url) {
  return new Promise(resolve => {
    let image = new Image();

    image.src = url;
    image.onload = function() {
      resolve(image);
    };
  });
}

let logBuffer = [];
export function log(s) {
  logBuffer.push(s);
  if (logBuffer.length == 50) {
    console.log(logBuffer);
    logBuffer = [];
  }
}

export function getDirection(speed, source, target) {
  const tx = target.x + source.width - (source.x + source.width / 2);
  const ty = target.y + source.height - (source.y + source.height / 2);
  const dist = Math.sqrt(tx * tx + ty * ty);

  return {
    dx: tx / dist * speed,
    dy: ty / dist * speed,
    angle: Math.atan2(ty, tx)
  };
}

export function setCanvasSize(givenWidth, givenHeight) {
  const canvas = document.querySelector("#canvas");
  const dimensions = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  canvas.width = givenWidth || dimensions.width;
  canvas.height = givenHeight || dimensions.height;
  canvas.style.marginLeft = `${~~((dimensions.width - canvas.width) / 2)}px`;
  canvas.style.marginTop = `${~~((dimensions.height - canvas.height) / 2)}px`;

  return dimensions;
}

export function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

export function collides(a, b) {
  return (
    a &&
    b &&
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
