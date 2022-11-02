import * as ModuleId from '../ModuleId/ModuleId.js'

export const getModuleId = (commandId) => {
  switch (commandId) {
    case 'Terminal.render':
      return ModuleId.Terminal
    case 'OffscreenCanvas.add':
      return ModuleId.OffscreenCanvas
    case 'TerminalConnection.create':
      return ModuleId.TerminalConnection
    default:
      throw new Error(`command ${commandId} not found`)
  }
}
