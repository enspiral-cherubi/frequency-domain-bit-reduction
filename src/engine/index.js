import THREE from 'three'
import Environment from './environment'
import View from './view'
import FreqBitReducer from './freq-bit-reducer'
import $ from 'jquery'
import loop from 'raf-loop'

class Engine {

  constructor () {
    this.environment = new Environment()
    this.view = new View()
    this.freqBitReducer = new FreqBitReducer()
  }

  bindEventListeners () {
    $(window).load(this.view.closeLoadingScreen)
  }

  start () {
    loop((t) => {
      this.environment.render()
      this.freqBitReducer.play()
    }).start()
  }

}

export default Engine
