import * as ModuleId from '../ModuleId/ModuleId.js'

export const getModuleId = (commandId) => {
  switch (commandId) {
    case 'Canvas.addCanvas':
      return ModuleId.Canvas
    default:
      throw new Error(`command ${commandId} not found`)
  }
}
