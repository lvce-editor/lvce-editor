import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const startRecording = (options) => {
  return ParentIpc.invoke('ElectronContentTracing.startRecording', options)
}

export const stopRecording = () => {
  return ParentIpc.invoke('ElectronContentTracing.stopRecording')
}
