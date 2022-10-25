import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const name = ViewletModuleId.RunAndDebug

export const create = (id) => {
  return {
    id,
    disposed: false,
  }
}

export const loadContent = async (state) => {
  return state
}

// TODO make sure dispose is actually called
export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const hasFunctionalRender = true

export const hasFunctionalResize = true

export const render = []

export const resize = (state, dimensions) => {
  return { ...state, ...dimensions }
}
