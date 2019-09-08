export function initAudio() {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var processor = context.createScriptProcessor(1024, 1, 1);
    processor.connect(context.destination);

    var handleSuccess = function(stream) {
      var input = context.createMediaStreamSource(stream);
      input.connect(processor);

      var receivedAudio = false;
      processor.onaudioprocess = function(e) {
        // This will be called multiple times per second.
        // The audio data will be in e.inputBuffer
        if (!receivedAudio) {
          receivedAudio = true;
          console.log("Received audio", e);
        }
      };
    };

    return navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(handleSuccess);
}
