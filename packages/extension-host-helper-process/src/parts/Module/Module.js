import * as ModuleId from '../ModuleId/ModuleId.js'

export const load = (moduleId) => {
  switch (moduleId) {
    case ModuleId.Exec:
      return import('../Exec/Exec.ipc.js')
    default:
      throw new Error(`module ${moduleId} not found`)
  }
}
