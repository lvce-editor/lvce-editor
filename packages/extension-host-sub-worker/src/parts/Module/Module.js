import * as ModuleId from '../ModuleId/ModuleId.js'

export const load = (moduleId) => {
  switch (moduleId) {
    case ModuleId.Exec:
      return import('../Exec/Exec.ipc.js')
    case ModuleId.Ajax:
      return import('../Ajax/Ajax.ipc.js')
    default:
      throw new Error(`module ${moduleId} not found`)
  }
}
