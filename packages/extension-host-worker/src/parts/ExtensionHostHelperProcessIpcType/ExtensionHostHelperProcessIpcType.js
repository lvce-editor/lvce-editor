import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const getIpcType = () => {
  const isElectron = navigator.userAgent.includes('Electron')
  if (isElectron) {
    return IpcParentType.ElectronMessagePort
  }
  return IpcParentType.WebSocket
}
