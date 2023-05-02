export const WebSocket = 1
export const MessagePort = 2
export const Parent = 3
export const ElectronMessagePort = 4
export const ElectronUtilityProcess = 5
export const ElectronUtilityProcessMessagePort = 6
export const ModuleWorker = 7

const getRawIpcTypeNode = async () => {
  const { argv } = process
  const ParseCliArgs = await import('../ParseCliArgs/ParseCliArgs.js')
  const parsedArgs = ParseCliArgs.parseCliArgs(argv.slice(2))
  const ipcType = parsedArgs['ipc-type']
  return ipcType
}

const getRawIpcType = () => {
  if (typeof process !== 'undefined') {
    return getRawIpcTypeNode()
  }
  return 'module-worker'
}

export const Auto = async () => {
  const ipcType = await getRawIpcType()
  console.log({ ipcType })
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
    case 'module-worker':
      return ModuleWorker
    default:
      throw new Error(`[extension-host-helper-process] unknown ipc type ${ipcType}`)
  }
}
