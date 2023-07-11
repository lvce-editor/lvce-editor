const { screen } = require('electron')

exports.getWidth = () => {
  const primaryDisplay = screen.getPrimaryDisplay()
  return primaryDisplay.bounds.width
}

exports.getHeight = () => {
  const primaryDisplay = screen.getPrimaryDisplay()
  return primaryDisplay.bounds.height
}

exports.getBounds = () => {
  const primaryDisplay = screen.getPrimaryDisplay()
  return {
    width: primaryDisplay.bounds.width,
    height: primaryDisplay.bounds.height,
  }
}
