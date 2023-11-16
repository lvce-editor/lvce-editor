export const state = {
  pending: Object.create(null),
}

export const get = (id) => {
  return state.pending[id]
}

export const has = (id) => {
  return id in state.pending
}

export const set = (id, value) => {
  state.pending[id] = value
}
