const VError = require('verror')
const Screen = require('../ElectronScreen/ElectronScreen.js')
const Window = require('../ElectronWindow/ElectronWindow.js')
const Performance = require('../Performance/Performance.js')
const LifeCycle = require('../LifeCycle/LifeCycle.js')
const Session = require('../ElectronSession/ElectronSession.js')
const Platform = require('../Platform/Platform.js')
const Preferences = require('../Preferences/Preferences.js')
const Electron = require('electron')

exports.state = {
  /**
   * @type {any[]}
   */
  windows: [],
}

exports.findById = (id) => {
  for (const window of this.state.windows) {
    if (window.id === id) {
      return window
    }
  }
  return undefined
}

exports.remove = (id) => {
  const index = exports.state.windows.findIndex((window) => window.id === id)
  if (index === -1) {
    throw new Error('expected window to be in windows array')
  }
  exports.state.windows.splice(index, 1)
}

exports.add = (config) => {
  exports.state.windows.push(config)
}
