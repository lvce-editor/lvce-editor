const MessagePort = 1
export const ModuleWorker = 2
const ReferencePort = 3
export const ModuleWorkerAndMessagePort = 8

export const Auto = () => {
  // @ts-ignore
  if (globalThis.acceptPort) {
    return MessagePort
  }
  // @ts-ignore
  if (globalThis.acceptReferencePort) {
    return ReferencePort
  }
  return ModuleWorkerAndMessagePort
}
