import * as ExtensionHostIpc from '../ExtensionHostIpc/ExtensionHostIpc.js'

export const name = 'webExtensionHost'

export const ipc = ExtensionHostIpc.Methods.ModuleWebWorker

export const canActivate = (extension) => {
  return typeof extension.browser === 'string'
}

export const create = () => {
  return {
    // Completion
    executeCompletionProvider:
      ExtensionHostCompletion.executeCompletionProvider,

    // Definition
    executeDefinitionProvider() {},

    // File system
    readDirWithFileTypes() {},

    // Type Definition
    executeTypeDefinitionProvider() {},
  }
}
