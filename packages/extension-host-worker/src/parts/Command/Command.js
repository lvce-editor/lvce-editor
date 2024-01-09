export const state = {
  getFn() {},
}

export const execute = (method, ...params) => {
  const fn = state.getFn(method)
  if (!fn) {
    throw new Error(`command not found ${method}`)
  }
  return fn(...params)
}
