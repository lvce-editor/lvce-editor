const state = {
  idMap: Object.create(null),
}

export const register = (id, module) => {
  state.idMap[id] = module
}

export const get = (id) => {
  return state.idMap[id]
}
