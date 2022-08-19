import * as ExtensionHostCommand from '../ExtensionHost/ExtensionHostCommands.js'

export const execute = async (id, ...args) => {
  await ExtensionHostCommand.executeCommand(id)
}
