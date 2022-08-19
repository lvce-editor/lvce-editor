import * as ExtensionHostShared from './ExtensionHostShared.js'
import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'

const getCommandsFromExtension = (extension) => {
  if (!extension || !extension.commands) {
    return []
  }
  return extension.commands
}

const getCommandsFromExtensions = (extensions) => {
  return extensions.flatMap(getCommandsFromExtension)
}

export const getCommands = async () => {
  const extensions = await ExtensionMeta.getExtensions()
  const commands = getCommandsFromExtensions(extensions)
  return commands
}

// TODO add test for this
// TODO add test for when this errors

export const executeCommand = (id) => {
  return ExtensionHostShared.executeProvider({
    event: `onCommand:${id}`,
    method: 'ExtensionHost.executeCommand',
    params: [id],
    noProviderFoundMessage: 'No command provider found',
  })
}
