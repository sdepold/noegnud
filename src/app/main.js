import initGame from "./init";

(() => {
  const button = document.getElementById("start");

  const initAudio = () => {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var processor = context.createScriptProcessor(1024, 1, 1);
    processor.connect(context.destination);

    var handleSuccess = function (stream) {
      var input = context.createMediaStreamSource(stream);
      input.connect(processor);

      var recievedAudio = false;
      processor.onaudioprocess = function (e) {
        // This will be called multiple times per second.
        // The audio data will be in e.inputBuffer
        if (!recievedAudio) {
          recievedAudio = true;
          console.log('got audio', e);
        }
      };
    };

    return navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(handleSuccess);
  }

  button.addEventListener("click", () => {
    button.remove();
    initAudio().then(initGame, ()=> {
        alert('Launching game without audio!')
        initGame();
    });
  });
})();
