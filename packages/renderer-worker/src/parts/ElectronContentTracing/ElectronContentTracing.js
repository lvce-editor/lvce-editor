import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const startRecording = (options) => {
  return ElectronProcess.invoke(
    'ElectronContentTracing.startRecording',
    options
  )
}

/**
 * @returns {Promise<string>}
 */
export const stopRecording = () => {
  return ElectronProcess.invoke('ElectronContentTracing.stopRecording')
}
