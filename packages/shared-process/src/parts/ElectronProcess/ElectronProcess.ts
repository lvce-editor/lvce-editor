import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const getElectronVersion = (): any => {
  return ParentIpc.invoke('Process.getElectronVersion')
}

export const getChromeVersion = (): any => {
  return ParentIpc.invoke('Process.getChromeVersion')
}
