const ElectronContentTracing = require('./ElectronContentTracing.js')

// prettier-ignore
exports.Commands = {
  'ElectronContentTracing.startRecording': ElectronContentTracing.startRecording,
  'ElectronContentTracing.stopRecording': ElectronContentTracing.stopRecording,
}
