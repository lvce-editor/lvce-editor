import * as ElectronContentTracing from './ElectronContentTracing.js'

export const name = 'ElectronContentTracing'

export const Commands = {
  startRecording: ElectronContentTracing.startRecording,
  stopRecording: ElectronContentTracing.stopRecording,
}
