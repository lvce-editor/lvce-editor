import * as ParseCliArgs from '../ParseCliArgs/ParseCliArgs.js'

export const WebSocket = 1
export const MessagePort = 2
export const Parent = 3
export const ElectronMessagePort = 4
export const ElectronUtilityProcess = 5
export const ElectronUtilityProcessMessagePort = 6
export const NodeForkedProcess = 7

const getRawIpcType = () => {
  const { argv } = process
  const parsedArgs = ParseCliArgs.parseCliArgs(argv.slice(2))
  const ipcType = parsedArgs['ipc-type']
  return ipcType
}

export const Auto = () => {
  const ipcType = getRawIpcType()
  switch (ipcType) {
    case 'websocket':
      return WebSocket
    case 'message-port':
      return MessagePort
    case 'parent':
      return Parent
    case 'electron-message-port':
      return ElectronMessagePort
    case 'electron-utility-process':
      return ElectronUtilityProcess
    case 'electron-utility-process-message-port':
      return ElectronUtilityProcessMessagePort
    case 'node-forked-process':
      return NodeForkedProcess
    default:
      throw new Error(`[extension-host-helper-process] unknown ipc type ${ipcType}`)
  }
}
