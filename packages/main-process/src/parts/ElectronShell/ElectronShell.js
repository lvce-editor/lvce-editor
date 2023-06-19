const { shell } = require('electron')
const OpenExternal = require('../OpenExternal/OpenExternal.js')

exports.showItemInFolder = (fullPath) => {
  shell.showItemInFolder(fullPath)
}

/**
 * @deprecated use OpenExternal.openExternal function instead
 */
exports.openExternal = OpenExternal.openExternal

exports.openPath = async (path) => {
  // TODO handle error
  await shell.openPath(path)
}

/**
 * @deprecated use Beep.beep instead
 */
exports.beep = () => {
  const Beep = require('../Beep/Beep.js')
  Beep.beep()
}
