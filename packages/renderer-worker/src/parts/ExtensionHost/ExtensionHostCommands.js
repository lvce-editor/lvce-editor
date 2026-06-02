import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
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

const isCommandNotFoundError = (error) => {
  return error instanceof Error && error.name === 'CommandNotFoundError'
}

const executeLegacyExtensionHostCommand = (id, args) => {
  return ExtensionHostShared.executeProvider({
    event: `onCommand:${id}`,
    method: ExtensionHostCommandType.CommandExecute,
    params: [id, ...args],
    noProviderFoundMessage: 'No command provider found',
  })
}

export const executeCommand = async (id, ...args) => {
  try {
    return await ExtensionManagementWorker.invoke('Extensions.executeCommand', id, ...args)
  } catch (error) {
    if (!isCommandNotFoundError(error)) {
      throw error
    }
    return executeLegacyExtensionHostCommand(id, args)
  }
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
