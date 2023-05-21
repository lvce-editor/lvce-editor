import * as Assert from '../Assert/Assert.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const create = (id) => {
  Assert.number(id)
  return {
    disposed: false,
    uid: id,
  }
}

export const getChildren = () => {
  return [
    {
      id: ViewletModuleId.Terminal,
    },
  ]
}

export const loadContent = async (state) => {
  return {
    ...state,
  }
}

export const hasFunctionalRender = true
