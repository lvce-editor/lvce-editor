import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getPid = () => {
  return SharedProcess.invoke('Process.getPid')
}

export const getElectronVersion = () => {
  return SharedProcess.invoke('ElectronProcess.getElectronVersion')
}

export const getNodeVersion = () => {
  return SharedProcess.invoke('Process.getNodeVersion')
}

export const getChromeVersion = () => {
  return SharedProcess.invoke('ElectronProcess.getChromeVersion')
}

export const getVersion = () => {
  return SharedProcess.invoke('Platform.getVersion')
}

export const getCommit = () => {
  return SharedProcess.invoke('Platform.getCommit')
}

export const getV8Version = () => {
  return SharedProcess.invoke('Process.getV8Version')
}

export const getDate = () => {
  return SharedProcess.invoke('Platform.getDate')
}

export const getArch = () => {
  return SharedProcess.invoke('Process.getArch')
}
