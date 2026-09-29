import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const getArgv = (): any => {
  return ParentIpc.invoke('Process.getArgv')
}

export const getElectronVersion = (): any => {
  return ParentIpc.invoke('Process.getElectronVersion')
}

export const getChromeVersion = (): any => {
  return ParentIpc.invoke('Process.getChromeVersion')
}

export const writeStderr = (value: string): any => {
  return ParentIpc.invoke('Process.writeStderr', value)
}

export const writeStdout = (value: string): any => {
  return ParentIpc.invoke('Process.writeStdout', value)
}
