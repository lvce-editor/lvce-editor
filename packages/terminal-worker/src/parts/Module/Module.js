import * as ModuleId from '../ModuleId/ModuleId.js'

export const load = (moduleId) => {
  switch (moduleId) {
    case ModuleId.Terminal:
      return import('../Terminal/Terminal.ipc.js')
    case ModuleId.OffscreenCanvas:
      return import('../OffscreenCanvas/OffscreenCanvas.ipc.js')
    default:
      throw new Error(`module ${moduleId} not found`)
  }
}
