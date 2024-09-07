import * as Promises from '../Promises/Promises.js'

export const sleep = (duration) => {
  const { resolve, promise } = Promises.withResolvers()
  setTimeout(resolve, duration)
  return promise
}
