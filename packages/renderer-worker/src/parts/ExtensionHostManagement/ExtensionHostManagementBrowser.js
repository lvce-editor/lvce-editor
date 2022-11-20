import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const name = 'webExtensionHost'

export const ipc = IpcParentType.ModuleWorker

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
