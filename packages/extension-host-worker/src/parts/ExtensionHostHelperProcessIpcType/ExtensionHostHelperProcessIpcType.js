import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsElectron from '../IsElectron/IsElectron.js'

export const getIpcType = () => {
  if (IsElectron.isElectron()) {
    return IpcParentType.ElectronMessagePort
  }
  return IpcParentType.WebSocket
}
