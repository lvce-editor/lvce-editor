export const nameAnonymousFunction = (fn, name) => {
  Object.defineProperty(fn, 'name', {
    value: name,
  })
}
