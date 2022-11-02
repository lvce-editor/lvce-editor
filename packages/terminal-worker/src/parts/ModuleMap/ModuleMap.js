import * as ModuleId from '../ModuleId/ModuleId.js'

export const getModuleId = (commandId) => {
  switch (commandId) {
    case 'Terminal.addCanvas':
      return ModuleId.Terminal
    default:
      throw new Error(`command ${commandId} not found`)
  }
}
