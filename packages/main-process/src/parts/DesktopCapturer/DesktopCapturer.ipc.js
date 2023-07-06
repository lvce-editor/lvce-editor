const DesktopCapturer = require('./DesktopCapturer.js')

exports.name = 'DesktopCapturer'

exports.Commands = {
  getSources: DesktopCapturer.getSources,
}
