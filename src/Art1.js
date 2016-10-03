import React, { Component } from 'react';
import GraphAudio from './GraphAudio';
const createCamera = require('perspective-camera');
const lerp = require('lerp');

class Art1 extends Component {

  componentDidMount() {
    const { canvas } = this.refs;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight / 2;
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth / 2;
      canvas.height = window.innerHeight / 2;
    });

    this.canvas = canvas;

    this.ctx = ctx;

    const radius = 100;

    const center = {
      x: canvas.width / 2,
      y: canvas.height / 2,
    }

    const steps = 5000;

    const points = Array.from(new Array(steps), (d, i) => {
      const x = (radius * Math.cos(2 * Math.PI * i / steps));
      const y = (radius * Math.sin(2 * Math.PI * i / steps));
      const z =  (Math.random() > 0) ? Math.random() : -1 * Math.random()
      return {
        x,
        y,
        z: z * 14
      }
    })

    const camera = createCamera({
      fov: Math.PI / 4,
      near: 0.01,
      far: 100,
      viewport: [0, 0, canvas.width, canvas.height]
    });

    camera.identity()
    camera.translate([ 0, 0, 400 ])
    camera.lookAt([ 0, 0, 0 ])
    camera.update()

    this.testSet = {
      camera,
      points,
    }
    window.addEventListener('keydown', ({ key }) => {

    });

    const audio = new GraphAudio('https://soundcloud.com/jay-smoove-425/yggr-smtm3-remix-dok2-the-quiett-san-e-swings-master-wu-ydg');
    audio.play(() => {
      const renderId = Date.now();
      this.renderId = renderId;
      requestAnimationFrame((time) => {
        this.renderToCanvas(time, renderId)
      });
    });
    this.audio = audio;
  }

  update(dt) {

  }

  renderToCanvas(time, renderId) {
    const { ctx, canvas, testSet, audio } = this;
    const { camera } = testSet;

    if (!testSet.pt)
      testSet.pt = time;

    this.update(time - testSet.pt);

    const waveform = audio.waveform();
    const duration = audio.duration();
    const radius = 100 * (1. - time / duration);

    const points = Array.from(new Array(waveform.length), (d, i) => {
      const a = lerp(time / 1000, time / 1000 + 0.0001, i);

      const x = (radius * Math.cos(a));
      const y = (radius * Math.sin(a));

      const z = waveform[i] / 128 * 20.
      return {
        x,
        y,
        z
      }
    });

    ctx.beginPath();
//    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const alpha = 0.25;
    ctx.strokeStyle = 'rgba(0, 0, 0, ' + alpha + ')'
    ctx.lineJoin = 'round';
    ctx.lineWidth = 1;
    points.forEach(({x, y, z}) => {
      let [px, py] = camera.project([x, y, z]);
      ctx.lineTo(px, py)
    });
    ctx.stroke();

    testSet.pt = time;

    if (this.renderId == renderId) {
      requestAnimationFrame((t) => this.renderToCanvas(t, renderId));
    }
  }

  render() {

    return (
      <div ref='layout'>
        <canvas ref='canvas' />
      </div>
    )
  }
}

export default Art1;
