import * as ExtensionHostIpc from '../ExtensionHostIpc/ExtensionHostIpc.js'
import * as ExtensionHostRpc from '../ExtensionHostRpc/ExtensionHostRpc.js'

/**
 * @enum {number}
 */
const ExtensionHostState = {
  Off: 0,
  Loading: 1,
  Running: 2,
  Error: 3,
}

export const state = {
  /**
   * @type {any}
   */
  pendingIpc: undefined,
}

export const startExtensionHost = async (ipcType) => {
  const exisingIpcPromise = state.pendingIpc
  if (exisingIpcPromise) {
    const ipc = await exisingIpcPromise
    return {
      type: ipcType,
      ipc,
    }
  }
  const promise = ExtensionHostIpc.listen(ipcType).then(ExtensionHostRpc.listen)
  state.pendingIpc = promise
  const ipc = await promise
  return {
    type: ipcType,
    ipc,
  }
}

export const stopExtensionHost = async (key) => {
  const existingExtensionHost = state.extensionHosts[key]
  if (existingExtensionHost) {
    switch (existingExtensionHost.state) {
      case ExtensionHostState.Off:
        throw new Error('extension host cannot be off')
      case ExtensionHostState.Loading:
      case ExtensionHostState.Error:
        existingExtensionHost.ipc.dispose()
        break
      default:
        throw new Error('invalid extension host state')
    }
  }
}

export const canActivate = (manager, extensions) => {
  return extensions.some(manager.canActivate)
}
