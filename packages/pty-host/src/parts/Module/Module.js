import * as ModuleId from '../ModuleId/ModuleId.js'

export const load = (moduleId) => {
  switch (moduleId) {
    case ModuleId.PtyController:
      return import('../PtyController/PtyController.ipc.js')
    default:
      throw new Error(`module ${moduleId} not found`)
  }
}
