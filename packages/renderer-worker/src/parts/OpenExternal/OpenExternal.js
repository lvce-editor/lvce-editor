import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const showItemInFolder = (fullPath) => {
  return SharedProcess.invoke('OpenExternal.showItemInFolder', fullPath)
}

export const openExternal = (url) => {
  return SharedProcess.invoke('OpenExternal.openExternal', url)
}
