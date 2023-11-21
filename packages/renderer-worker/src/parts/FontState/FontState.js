export const state = {
  pending: Object.create(null),
  loaded: Object.create(null),
}

export const setPending = (id, promise) => {
  state.pending[id] = promise
}

export const getPending = (id) => {
  return state.pending[id]
}

export const hasPending = (id) => {
  return id in state.pending
}

export const removePending = (id) => {
  delete state.pending[id]
}

export const setLoaded = (id) => {
  state.loaded[id] = true
}

export const isLoaded = (id) => {
  return state.loaded[id]
}
