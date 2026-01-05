import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as ExtensionHostShared from './ExtensionHostShared.js'

const getCommandsFromExtension = (extension) => {
  if (!extension || !extension.commands) {
    return []
  }
  return extension.commands
}

const getCommandsFromExtensions = (extensions) => {
  return extensions.flatMap(getCommandsFromExtension)
}

export const getCommands = async (assetDir, platform) => {
  const extensions = await ExtensionMeta.getExtensions(assetDir, platform)
  const commands = getCommandsFromExtensions(extensions)
  return commands
}

// TODO add test for this
// TODO add test for when this errors

export const executeCommand = (id, ...args) => {
  return ExtensionHostShared.executeProvider({
    event: `onCommand:${id}`,
    method: ExtensionHostCommandType.CommandExecute,
    params: [id, ...args],
    noProviderFoundMessage: 'No command provider found',
  })
}

export const searchFileWithFetch = (...args) => {
  return ExtensionHostWorker.invoke('SearchFileWithFetch.searchFileWithFetch', ...args)
}

export const searchFileWithHtml = (...args) => {
  return ExtensionHostWorker.invoke('SearchFileWithHtml.searchFileWithHtml', ...args)
}

export const searchFileWithMemory = (...args) => {
  return ExtensionHostWorker.invoke('SearchFileWithMemory.searchFileWithMemory', ...args)
}
