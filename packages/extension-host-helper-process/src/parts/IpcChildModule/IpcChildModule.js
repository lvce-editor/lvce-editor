import {
  IpcChildWithElectronMessagePort,
  IpcChildWithElectronUtilityProcess,
  IpcChildWithNodeForkedProcess,
  IpcChildWithWebSocket,
} from '@lvce-editor/ipc'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.WebSocket:
      return IpcChildWithWebSocket
    case IpcChildType.NodeForkedProcess:
      return IpcChildWithNodeForkedProcess
    case IpcChildType.ElectronMessagePort:
      return IpcChildWithElectronMessagePort
    case IpcChildType.ElectronUtilityProcess:
      return IpcChildWithElectronUtilityProcess
    default:
      throw new Error('unexpected ipc type')
  }
}
