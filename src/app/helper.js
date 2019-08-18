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

export function setCanvasSize() {
  const canvas = document.querySelector("#canvas");
  const dimensions = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  return dimensions;
}
