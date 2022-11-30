import * as ModuleId from '../ModuleId/ModuleId.js'

export const state = {
  modules: Object.create(null),
}

export const registerMultiple = (modules) => {
  Object.assign(state.modules, modules)
}

export const load = (moduleId) => {
  return state.modules[moduleId]
}
