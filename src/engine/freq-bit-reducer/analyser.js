import range from 'lodash.range'
import getClosest from 'get-closest'
import LogScale from 'log-scale'
import unique from 'array-unique'

class Analyser {
  constructor (opts) {
    this.node = opts.context.createAnalyser()
    this.node.fftSize = opts.fftSize
    this.frequencyDataArray = new Uint8Array(this.node.frequencyBinCount)

    var binCount = opts.binCount
    var bandSpacing = opts.context.sampleRate / this.node.fftSize

    // get all frequency values being measured by analyser
    var allFrequencies = range(this.frequencyDataArray.length).map((n) => {
      return parseInt(n * bandSpacing)
    })

    var logScale = new LogScale(0, this.frequencyDataArray.length)

    // find all the frequency values that we want to measure, based on bin count
    this.frequencyDataArrayIndices = unique(range(0, 1, 1 / binCount).map((val) => {
      return logScale.linearToLogarithmic(val)
    }))

    // all gooodddd
    this.frequencies = this.frequencyDataArrayIndices.map((i) => {
      return allFrequencies[i]
    })

    console.log('this.frequencies: ', this.frequencies)
    console.log('this.frequencies.length: ', this.frequencies.length)
  }

  getFrequencyData () {
    this.node.getByteFrequencyData(this.frequencyDataArray)
    return this.frequencyDataArrayIndices.map((frequencyDataArrayIndex, frequenciesIndex) => {
      return {
        freq: this.frequencies[frequenciesIndex],
        amp: this.frequencyDataArray[frequencyDataArrayIndex]
      }
    })
  }

}

export default Analyser
