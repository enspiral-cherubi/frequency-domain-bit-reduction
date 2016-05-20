import $ from 'jquery'
import MicSelector from 'mic-selector'
import webAudioAnalyser2 from 'web-audio-analyser-2'
import scale from 'scale-number-range'

class FreqBitReducer {

  constructor () {
    this.context = new (window.AudioContext || window.webkitAudioContext)()
    this.analyser = webAudioAnalyser2({
      context: this.context,
      fftSize: 2048,
      addSubBassToBarkScale: true
    })
    this.output = this.context.destination
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
    navigator.getUserMedia({audio: true}, (stream) => {
      this.input = this.context.createMediaStreamSource(stream)
      this.input.connect(this.analyser)
      this.analyser.connect(this.output)
    }, console.log)

    this.audioNodes = this._generateAudioNodes()
  }

  play () {
    var barkScaleFrequencyData = this.analyser.barkScaleFrequencyData()
    console.log(barkScaleFrequencyData.frequencies)

    barkScaleFrequencyData.frequencies.forEach((amp, i) => {
      var audioNode = this.audioNodes[i]
      var gain = scale(amp, 0, 255, 0.0, 1.0)
      audioNode.gainNode.gain.value = gain
    })

  }

  _generateAudioNodes () {
    var barkScaleFrequencyData = this.analyser.barkScaleFrequencyData()
    var barkScaleFrequencies = [20, 60, 150, 250, 350, 450, 570, 700, 840, 1000, 1170, 1370, 1600, 1850, 2150, 2500, 2900, 3400, 4000, 4800, 5800, 7000, 8500, 10500, 13500]
    return barkScaleFrequencies.map((freq) => {
      var oscillatorNode = this.context.createOscillator()
      oscillatorNode.type = 'sine'
      oscillatorNode.frequency.value = freq
      var gainNode = this.context.createGain()
      gainNode.gain.value = 0
      oscillatorNode.connect(gainNode)
      gainNode.connect(this.output)
      oscillatorNode.start()
      return {
        oscillatorNode: oscillatorNode,
        gainNode: gainNode
      }
    })
  }

}

export default FreqBitReducer
