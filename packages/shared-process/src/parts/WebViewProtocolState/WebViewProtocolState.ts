const state = {
  promise: undefined,
}

export const getOrCreate = (fn) => {
  if (!state.promise) {
    state.promise = fn()
  }
  return state.promise
}
