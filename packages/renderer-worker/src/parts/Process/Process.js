import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getPid = () => {
  return SharedProcess.invoke('Process.getPid')
}

export const getElectronVersion = () => {
  return ElectronProcess.invoke('Process.getElectronVersion')
}

export const getNodeVersion = () => {
  return SharedProcess.invoke('Process.getNodeVersion')
}

export const getChromeVersion = () => {
  return ElectronProcess.invoke('Process.getChromeVersion')
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
