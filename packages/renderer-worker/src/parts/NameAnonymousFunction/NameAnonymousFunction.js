export const nameAnonymousFunction = (fn, name) => {
  if (typeof fn !== 'function') {
    return
  }
  Object.defineProperty(fn, 'name', {
    value: name,
  })
}
