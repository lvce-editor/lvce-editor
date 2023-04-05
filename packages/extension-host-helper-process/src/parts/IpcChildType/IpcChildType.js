import * as ParseCliArgs from '../ParseCliArgs/ParseCliArgs.js'

export const WebSocket = 1
export const MessagePort = 2
export const Parent = 3
export const ElectronMessagePort = 4

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
    default:
      throw new Error(`[extension-host-helper-process] unknown ipc type ${ipcType}`)
  }
}
