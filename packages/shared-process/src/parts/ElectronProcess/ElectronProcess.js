import * as ParentIpc from '../MainProcess/MainProcess.js'

export const getElectronVersion = () => {
  return ParentIpc.invoke('Process.getElectronVersion')
}

export const getChromeVersion = () => {
  return ParentIpc.invoke('Process.getChromeVersion')
}
