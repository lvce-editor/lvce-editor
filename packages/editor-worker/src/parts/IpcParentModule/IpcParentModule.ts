import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

export const getModule = (method: any) => {
  switch (method) {
    case IpcParentType.NodeAlternate:
      return import('../IpcParentWithNodeAlternate/IpcParentWithNodeAlternate.ts')
    case IpcParentType.RendererProcess:
      return import('../IpcParentWithRendererProcess/IpcParentWithRendererProcess.ts')
    case IpcParentType.ExtensionHostWorker:
      return import('../IpcParentWithExtensionHostWorker/IpcParentWithExtensionHostWorker.ts')
    default:
      throw new Error('unexpected ipc type')
  }
}
