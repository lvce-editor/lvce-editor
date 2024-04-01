import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

export const getModule = (method) => {
  switch (method) {
    case IpcParentType.NodeAlternate:
      return import('../IpcParentWithNodeAlternate/IpcParentWithNodeAlternate.ts')
    default:
      throw new Error('unexpected ipc type')
  }
}
