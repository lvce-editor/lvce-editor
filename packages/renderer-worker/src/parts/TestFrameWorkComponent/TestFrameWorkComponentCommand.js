import * as Command from '../Command/Command.js'
import * as ExtensionHostCommand from '../ExtensionHost/ExtensionHostCommands.js'

export const execute = async (id, ...args) => {
  if (id === 'PointerCapture.mock' || id === 'PointerCapture.unmock') {
    return Command.execute(id)
  }
  await ExtensionHostCommand.executeCommand(id)
}
