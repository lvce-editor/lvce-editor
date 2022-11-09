const ElectronContentTracing = require('./ElectronContentTracing.js')

exports.name = 'ElectronContentTracing'

// prettier-ignore
exports.Commands = {
  startRecording: ElectronContentTracing.startRecording,
  stopRecording: ElectronContentTracing.stopRecording,
}
