import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const startRecording = () => {
  return ElectronProcess.invoke('ElectronContentTracing.startRecording')
}

/**
 * @returns {Promise<string>}
 */
export const stopRecording = () => {
  return ElectronProcess.invoke('ElectronContentTracing.stopRecording')
}
