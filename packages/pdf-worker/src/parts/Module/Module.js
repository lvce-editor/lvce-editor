import * as ModuleId from '../ModuleId/ModuleId.js'

export const load = (moduleId) => {
  switch (moduleId) {
    case ModuleId.Canvas:
      return import('../Canvas/Canvas.ipc.js')
    default:
      throw new Error(`module ${moduleId} not found`)
  }
}
