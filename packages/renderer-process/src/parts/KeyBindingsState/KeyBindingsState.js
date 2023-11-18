import * as Assert from '../Assert/Assert.js'

export const state = {
  identifiers: [],
}

export const setIdentifiers = (identifiers) => {
  state.identifiers = identifiers
}

export const getIdentifiers = () => {
  return state.identifiers
}
