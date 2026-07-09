import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const startRecording = (options) => {
  return ParentIpc.invoke('ElectronContentTracing.startRecording', options)
}

export const stopRecording = () => {
  return ParentIpc.invoke('ElectronContentTracing.stopRecording')
}
