const { powerSaveBlocker } = require('electron')

exports.start = (type) => {
  return powerSaveBlocker.start(type)
}

exports.stop = (id) => {
  powerSaveBlocker.stop(id)
}
