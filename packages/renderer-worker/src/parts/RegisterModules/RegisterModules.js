import * as Module from '../Module/Module.js'
import * as ModuleId from '../ModuleId/ModuleId.js'

const Imports = {
  Ajax: () => import('../Ajax/Ajax.ipc.js'),
  LocalStorage: () => import('../LocalStorage/LocalStorage.ipc.js'),
}

const modules = [
  {
    id: ModuleId.Ajax,
    fn: () => import('../Ajax/Ajax.ipc.js'),
  },
]

export const registerModules = () => {
  Module.registerMultiple({
    [ModuleId.Ajax]: Imports.Ajax,
    [ModuleId.LocalStorage]: Imports.LocalStorage,
  })
}
