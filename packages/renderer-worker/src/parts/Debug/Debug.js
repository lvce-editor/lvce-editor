import * as ExtensionHostDebug from '../ExtensionHost/ExtensionHostDebug.js'

export const listProcesses = async () => {
  return ExtensionHostDebug.listProcesses('node-debug')
}
