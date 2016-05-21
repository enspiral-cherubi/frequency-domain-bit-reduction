class Oscillator {

  constructor (opts = {}) {
    this.node = opts.context.createOscillator()
    this.node.type = 'sine'
    this.node.frequency.value = opts.frequency
    this.gainNode = opts.context.createGain()
    this.setGain(0)
    this.node.connect(this.gainNode)
    this.gainNode.connect(opts.output)
    this.node.start()
  }

  setGain (gain) {
    this.gainNode.gain.value = gain
  }

}

export default Oscillator
