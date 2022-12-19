import * as ExtensionHostDebug from '../ExtensionHost/ExtensionHostDebug.js'

export const listProcesses = async () => {
  return ExtensionHostDebug.listProcesses('node-debug')
}

export const continue_ = async () => {
  return ExtensionHostDebug.continue_('node-debug')
}

export const pause = async () => {
  return ExtensionHostDebug.pause('node-debug')
}

export const setPauseOnExceptions = () => {
  return ExtensionHostDebug.setPauseOnExceptions('node-debug', 'all')
}
