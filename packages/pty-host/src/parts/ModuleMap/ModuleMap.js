import * as ModuleId from '../ModuleId/ModuleId.js'

export const getModuleId = (commandId) => {
  switch (commandId) {
    case 'PtyController.create':
    case 'PtyController.write':
    case 'PtyController.dispose':
      return ModuleId.PtyController
    default:
      throw new Error(`command ${commandId} not found`)
  }
}
