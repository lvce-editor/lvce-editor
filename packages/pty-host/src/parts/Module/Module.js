import * as ModuleId from '../ModuleId/ModuleId.js'

export const load = (moduleId) => {
  switch (moduleId) {
    case ModuleId.HandleElectronMessagePort:
      return import('../HandleElectronMessagePort/HandleElectronMessagePort.ipc.js')
    case ModuleId.HandleWebSocket:
      return import('../HandleWebSocket/HandleWebSocket.ipc.js')
    case ModuleId.HandleNodeMessagePort:
      return import('../HandleNodeMessagePort/HandleNodeMessagePort.ipc.js')
    case ModuleId.Terminal:
      return import('../PtyController/PtyController.ipc.js')
    default:
      throw new Error(`module ${moduleId} not found`)
  }
}
