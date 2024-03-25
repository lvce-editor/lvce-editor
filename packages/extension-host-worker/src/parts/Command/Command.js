export const state = {
  getFn() {},
}

export const execute = (method, ...params) => {
  // @ts-ignore
  const fn = state.getFn(method)
  // @ts-ignore
  if (!fn) {
    throw new Error(`command not found ${method}`)
  }
  // @ts-ignore
  return fn(...params)
}
