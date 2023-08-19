import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const startRecording = (options) => {
  return SharedProcess.invoke('ElectronContentTracing.startRecording', options)
}

/**
 * @returns {Promise<string>}
 */
export const stopRecording = () => {
  return SharedProcess.invoke('ElectronContentTracing.stopRecording')
}
