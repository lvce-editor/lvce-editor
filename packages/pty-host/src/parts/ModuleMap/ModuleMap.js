import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as ModuleId from '../ModuleId/ModuleId.js'
import * as TerminalCommandType from '../TerminalProcessCommandType/TerminalProcessCommandType.js'

export const getModuleId = (commandId) => {
  switch (commandId) {
    case TerminalCommandType.TerminalCreate:
    case TerminalCommandType.TerminalDispose:
    case TerminalCommandType.TerminalWrite:
      return ModuleId.Terminal
    case TerminalCommandType.HandleElectronMessagePort:
      return ModuleId.HandleElectronMessagePort
    case TerminalCommandType.HandleWebSocket:
      return ModuleId.HandleWebSocket
    case TerminalCommandType.HandleNodeMessagePort:
      return ModuleId.HandleNodeMessagePort
    default:
      throw new CommandNotFoundError(commandId)
  }
}
