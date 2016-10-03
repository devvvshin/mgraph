const AudioAnalyser = require('web-audio-analyser');
const sresolve = require('soundcloud-resolve-jsonp');

class GraphAudio {

  constructor(url){
    this.clientId = '7fba85c9b838930c90a2c47e3bce56e6';
    this.setUrl(url);
    this.audioContext = (AudioContext) ? new AudioContext() : new webkitAudioContext();
  }

  play(playFunc, url) {
    if (url) this.setUrl(url);
    const { src, clientId } = this;

    sresolve({
      url: src,
      client_id: clientId,
    }, (err, { stream_url }) => {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.addEventListener('canplay', (() => {
        this.analyser = new AudioAnalyser(audio, this.audioContext, { stereo: false });
        audio.play();
        if (playFunc) playFunc();
      }));
      audio.src = stream_url + "?client_id=" + clientId;
      this.audio = audio;
      console.log(audio.src);
    });


  }

  duration() {
    const { audio } = this;
    if (audio) return audio.duration * 1000;
    else 0;
  }

  waveform() {
    const { analyser } = this;

    if (analyser) return analyser.waveform();
    else return null;
  }

  stop() {
    const { audio } = this;
    if (audio) audio.pause();
  }

  setUrl(url) {
    // to src
    this.src = url;
  }
}

export default GraphAudio;
