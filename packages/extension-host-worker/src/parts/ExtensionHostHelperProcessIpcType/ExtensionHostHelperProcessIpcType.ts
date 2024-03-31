import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'

export const getIpcType = () => {
  if (IsElectron.isElectron()) {
    return IpcParentType.ElectronMessagePort
  }
  return IpcParentType.WebSocket
}
