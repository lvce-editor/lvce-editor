import * as Assert from '../Assert/Assert.js'

export const create = (id) => {
  Assert.number(id)
  return {
    disposed: false,
    uid: id,
  }
}

export const loadContent = async (state) => {
  return {
    ...state,
  }
}
