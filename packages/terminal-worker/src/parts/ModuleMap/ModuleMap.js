import * as ModuleId from '../ModuleId/ModuleId.js'

export const getModuleId = (commandId) => {
  switch (commandId) {
    case 'Terminal.render':
      return ModuleId.Terminal
    case 'OffscreenCanvas.add':
      return ModuleId.OffscreenCanvas
    default:
      throw new Error(`command ${commandId} not found`)
  }
}
