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
  extensionPromiseCache: Object.create(null),
  extensionHosts: Object.create(null),
  pendingIpcs: Object.create(null),
}

const toActivatableExtension = (extension) => {
  return {
    path: extension.path,
    id: extension.id,
    main: extension.main,
  }
}

// const startExtensionHost = async (type) => {
//   return ExtensionHostIpc.listen(ExtensionHostIpc.Methods.SharedProcess)
// }

export const startExtensionHost = async (name, ipcType) => {
  const exisingIpcPromise = state.pendingIpcs[name]
  if (exisingIpcPromise) {
    const ipc = await exisingIpcPromise
    return {
      name: ipcType,
      ipc,
    }
  }
  if (state.extensionHosts[name]) {
    return state.extensionHosts[name]
  }
  const promise = ExtensionHostIpc.listen(ipcType).then(ExtensionHostRpc.listen)
  state.pendingIpcs[name] = promise
  const ipc = await promise
  state.extensionHosts[name] = {
    state: ExtensionHostState.Running,
    ipc,
    name: ipcType,
  }
  return state.extensionHosts[name]
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
