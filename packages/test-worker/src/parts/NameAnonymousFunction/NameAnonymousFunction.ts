export const nameAnonymousFunction = (fn: any, name: string) => {
  Object.defineProperty(fn, 'name', {
    value: name,
  })
}
