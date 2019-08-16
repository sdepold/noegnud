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

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
