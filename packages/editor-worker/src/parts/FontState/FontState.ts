export const state = {
  pending: Object.create(null),
  loaded: Object.create(null),
}

export const setPending = (id: any, promise: any) => {
  state.pending[id] = promise
}

export const getPending = (id: any) => {
  return state.pending[id]
}

export const hasPending = (id: any) => {
  return id in state.pending
}

export const removePending = (id: any) => {
  delete state.pending[id]
}

export const setLoaded = (id: any) => {
  state.loaded[id] = true
}

export const isLoaded = (id: any) => {
  return state.loaded[id]
}
