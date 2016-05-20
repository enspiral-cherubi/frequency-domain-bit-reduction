import $ from 'jquery'
import MicSelector from 'mic-selector'

class FreqBitReducer {

  constructor () {
    this.context = new (window.AudioContext || window.webkitAudioContext)()
    this.output = this.context.destination
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
    navigator.getUserMedia({audio: true}, (stream) => {
      this.input = this.context.createMediaStreamSource(stream)
      this.input.connect(this.output)
    }, console.log)
  }

  // 'private'

}

export default FreqBitReducer
