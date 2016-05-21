import $ from 'jquery'
import MicSelector from 'mic-selector'
import webAudioAnalyser2 from 'web-audio-analyser-2'
import scale from 'scale-number-range'
import Oscillator from './oscillator.js'

class FreqBitReducer {

  constructor () {
    this.context = new (window.AudioContext || window.webkitAudioContext)()
    this.analyser = webAudioAnalyser2({
      context: this.context,
      fftSize: 2048,
      addSubBassToBarkScale: true
    })
    this.gainNode = this.context.createGain()
    this.setGain(0.1)
    this.output = this.context.destination
    this.gainNode.connect(this.output)
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
    navigator.getUserMedia({audio: true}, (stream) => {
      this.input = this.context.createMediaStreamSource(stream)
      this.input.connect(this.analyser)
    }, console.log)
    this.oscillators = this._generateOscillators()
  }

  play () {
    var barkScaleFrequencyData = this.analyser.barkScaleFrequencyData()

    barkScaleFrequencyData.frequencies.forEach((amp, i) => {
      var gain = scale(amp, 0, 255, 0.0, 1.0)
      this.oscillators[i].setGain(gain)
    })
  }

  setGain (gain) {
    this.gainNode.gain.value = gain
  }

  _generateOscillators () {
    var barkScaleFrequencyData = this.analyser.barkScaleFrequencyData()
    var barkScaleFrequencies = [20, 60, 150, 250, 350, 450, 570, 700, 840, 1000, 1170, 1370, 1600, 1850, 2150, 2500, 2900, 3400, 4000, 4800, 5800, 7000, 8500, 10500, 13500]
    return barkScaleFrequencies.map((frequency) => {
      return new Oscillator({
        frequency: frequency,
        context: this.context,
        output: this.gainNode
      })
    })
  }

}

export default FreqBitReducer
