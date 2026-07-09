const state: any = {
  promise: undefined,
}

export const getOrCreate = (fn: any): any => {
  if (!state.promise) {
    state.promise = fn()
  }
  return state.promise
}
