import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const version = '0.0.0-dev'

export const commit = 'unknown commit'

export const date = ''

export const productNameLong = 'Lvce Editor - OSS'

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
  return version
}

export const getCommit = () => {
  return commit
}

export const getProductNameLong = () => {
  return productNameLong
}

export const getV8Version = () => {
  return SharedProcess.invoke('Process.getV8Version')
}

export const getDate = () => {
  return date
}

export const getArch = () => {
  return SharedProcess.invoke('Process.getArch')
}
