export const WebSocket = 1
export const MessagePort = 2
export const Parent = 3
export const ElectronMessagePort = 4
export const ElectronUtilityProcess = 5
export const ElectronUtilityProcessMessagePort = 6
export const ModuleWorker = 7

export const Auto = () => {
  if (globalThis.acceptPort) {
    return MessagePort
  }
  if (globalThis.acceptReferencePort) {
    return 0
  }
  return ModuleWorker
}
