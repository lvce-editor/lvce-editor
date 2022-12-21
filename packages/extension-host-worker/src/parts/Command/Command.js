export const state = {
  getFn() {},
}

export const execute = (method, ...params) => {
  const fn = state.getFn(method)
  return fn(...params)
}
