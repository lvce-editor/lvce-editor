import * as ElectronContentTracing from './ElectronContentTracing.ts'

export const name = 'ElectronContentTracing'

export const Commands = {
  startRecording: ElectronContentTracing.startRecording,
  stopRecording: ElectronContentTracing.stopRecording,
}
