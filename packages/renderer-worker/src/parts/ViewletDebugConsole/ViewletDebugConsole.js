import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const name = ViewletModuleId.DebugConsole

export const create = () => {
  return {
    disposed: false,
  }
}

export const loadContent = async (state) => {
  return state
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}
