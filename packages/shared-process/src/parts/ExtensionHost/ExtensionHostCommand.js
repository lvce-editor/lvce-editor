import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.js'

export const executeCommand = async (extensionHost, commandId, ...args) => {
  return extensionHost.invoke('executeCommand', commandId, ...args)
}

const getExtensionCommands = (extension) => {
  return extension.commands || []
}

export const getCommands = async () => {
  const extensions = await ExtensionManagement.getExtensions()
  return extensions.flatMap(getExtensionCommands)
}

export const getCommandsIpc = async () => {
  const commands = await getCommands()
  return commands
}
