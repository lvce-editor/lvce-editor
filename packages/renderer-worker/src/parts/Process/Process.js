import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getPid = async () => {
  const pid = await SharedProcess.invoke('Process.getPid')
  return pid
}

export const getElectronVersion = () => {
  return ElectronProcess.invoke('Process.getElectronVersion')
}

export const getNodeVersion = () => {
  return ElectronProcess.invoke('Process.getNodeVersion')
}

export const getChromeVersion = () => {
  return ElectronProcess.invoke('Process.getChromeVersion')
}

export const getVersion = () => {
  return ElectronProcess.invoke('Platform.getVersion')
}

export const getCommit = () => {
  return ElectronProcess.invoke('Platform.getCommit')
}

export const getV8Version = () => {
  return ElectronProcess.invoke('Process.getV8Version')
}
