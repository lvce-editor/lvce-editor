import { contentTracing } from 'electron'

/**
 * @param { Electron.TraceConfig | Electron.TraceCategoriesAndOptions} options
 */
export const startRecording = async (options) => {
  await contentTracing.startRecording(options)
}

export const stopRecording = () => {
  return contentTracing.stopRecording()
}
