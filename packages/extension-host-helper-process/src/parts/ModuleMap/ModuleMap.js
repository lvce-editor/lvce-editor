import * as ModuleId from '../ModuleId/ModuleId.js'

export const getModuleId = (commandId) => {
  switch (commandId) {
    case 'Exec.exec':
      return ModuleId.Exec
    default:
      throw new Error(`command ${commandId} not found`)
  }
}
