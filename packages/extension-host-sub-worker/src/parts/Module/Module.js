import * as ModuleId from '../ModuleId/ModuleId.js'

export const load = (moduleId) => {
  switch (moduleId) {
    default:
      throw new Error(`module ${moduleId} not found`)
  }
}
