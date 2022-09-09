const { contentTracing } = require('electron')

/**
 * @param { Electron.TraceConfig | Electron.TraceCategoriesAndOptions} options
 */
exports.startRecording = async (options) => {
  await contentTracing.startRecording(options)
}

exports.stopRecording = () => {
  return contentTracing.stopRecording()
}
