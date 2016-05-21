import range from 'lodash.range'
import getClosest from 'get-closest'
import unique from 'array-unique'

class Analyser {
  constructor (opts) {
    this.node = opts.context.createAnalyser()
    this.node.fftSize = opts.fftSize
    this.frequencyDataArray = new Uint8Array(this.node.frequencyBinCount)

    var bandSpacing = opts.context.sampleRate / this.node.fftSize

    this.frequencies = range(this.frequencyDataArray.length).map((n) => {
      return parseInt(n * bandSpacing)
    })
  }

  getFrequencyData () {
    this.node.getByteFrequencyData(this.frequencyDataArray)
    return this.frequencies.map((freq, i) => {
      return {
        freq: freq,
        amp: this.frequencyDataArray[i]
      }
    })
  }

}

export default Analyser
