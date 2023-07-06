const { desktopCapturer } = require('electron')
const { VError } = require('../VError/VError.js')

exports.getSources = async (options) => {
  try {
    const sources = await desktopCapturer.getSources(options)
    return sources
  } catch (error) {
    throw new VError(error, `Failed to get desktop capturer sources`)
  }
}
