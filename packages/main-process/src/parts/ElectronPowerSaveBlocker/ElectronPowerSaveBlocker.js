const { powerSaveBlocker } = require('electron')

/**
 *
 * @param {'prevent-app-suspension'|'prevent-display-sleep'} type
 * @returns
 */
exports.start = (type) => {
  return powerSaveBlocker.start(type)
}

/**
 * @param {number} id
 */
exports.stop = (id) => {
  powerSaveBlocker.stop(id)
}
