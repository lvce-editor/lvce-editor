export const withResolvers = () => {
  const { resolve, promise } = Promise.withResolvers()
  return {
    resolve,
    promise,
  }
}
