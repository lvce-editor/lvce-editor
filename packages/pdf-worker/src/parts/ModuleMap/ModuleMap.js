import * as ModuleId from '../ModuleId/ModuleId.js'

export const getModuleId = (commandId) => {
  switch (commandId) {
    case 'Canvas.addCanvas':
    case 'Canvas.focusPage':
    case 'Canvas.render':
    case 'Canvas.resize':
    case 'Canvas.setContent':
      return ModuleId.Canvas
    default:
      throw new Error(`command ${commandId} not found`)
  }
}
