var clientId = process.env.CLIENT_ID
import SoundcloudAudioInterface from 'soundcloud-audio-interface'
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
      fftSize: 1024
    })
    this.gainNode = this.context.createGain()
    this.setGain(0.01)
    this.output = this.context.destination
    this.gainNode.connect(this.output)

    this.scAudioInterface = new SoundcloudAudioInterface({ audioCtx: this.context, clientId: clientId })
    this.scAudioInterface.setUrl('https://soundcloud.com/rickhignett/arnold-schwarzenegger').then(() => {
      this.scAudioInterface.source.connect(this.analyser.node)
      this.scAudioInterface.audio.play()
    })

    this.oscillators = this._generateOscillators()
  }

  play () {
    each(this.analyser.getFrequencyData(), (data) => {
      var gain = scale(data.amp, 0, 255, 0.0, 1.0)
      this.oscillators[data.freq].setGain(gain)
    })
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
