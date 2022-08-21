const Electron = require('electron')

exports.getWidth = () => {
  const primaryDisplay = Electron.screen.getPrimaryDisplay()
  return primaryDisplay.bounds.width
}

exports.getHeight = () => {
  const primaryDisplay = Electron.screen.getPrimaryDisplay()
  return primaryDisplay.bounds.height
}

exports.getBounds = () => {
  const primaryDisplay = Electron.screen.getPrimaryDisplay()
  return {
    width: primaryDisplay.bounds.width,
    height: primaryDisplay.bounds.height,
  }
}
