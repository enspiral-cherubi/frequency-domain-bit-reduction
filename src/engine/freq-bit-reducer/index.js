import $ from 'jquery'
import Analyser from './analyser.js'
import scale from 'scale-number-range'
import Oscillator from './oscillator.js'
import each from 'lodash.foreach'

class FreqBitReducer {

  constructor () {
    this.context = new (window.AudioContext || window.webkitAudioContext)()
    this.analyser = new Analyser({
      context: this.context,
      fftSize: 2048,
      binCount: 1600
    })
    this.gainNode = this.context.createGain()
    this.setGain(0.1)
    this.output = this.context.destination
    this.gainNode.connect(this.output)
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
    navigator.getUserMedia({audio: true}, (stream) => {
      this.input = this.context.createMediaStreamSource(stream)
      this.input.connect(this.analyser.node)
    }, console.log)
    this.oscillators = this._generateOscillators()
  }

  play () {
    each(this.analyser.getFrequencyData(), (data) => {
      var gain = scale(data.amp, 0, 255, 0.0, 1.0)
      this.oscillators[data.freq].setGain(gain) })
  }

  setGain (gain) {
    this.gainNode.gain.value = gain
  }

  _generateOscillators () {
    var oscillators = {}
    this.analyser.frequencies.forEach((frequency) => {
      oscillators[frequency] = new Oscillator({
        frequency: frequency,
        context: this.context,
        output: this.gainNode
      })
    })
    return oscillators
  }

}

export default FreqBitReducer
