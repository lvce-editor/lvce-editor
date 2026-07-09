import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const startRecording = (options: any): any => {
  return ParentIpc.invoke('ElectronContentTracing.startRecording', options)
}

export const stopRecording = (): any => {
  return ParentIpc.invoke('ElectronContentTracing.stopRecording')
}
