export const MessagePort = 1
export const ModuleWorker = 2
export const ModuleWorkerWithMessagePort = 4

export const Auto = () => {
  if (globalThis.acceptPort) {
    return MessagePort
  }
  return ModuleWorkerWithMessagePort
}
