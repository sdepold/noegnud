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
