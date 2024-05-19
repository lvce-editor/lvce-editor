import * as Assert from '../Assert/Assert.ts'

export const textSearch = async (scheme, root, query) => {
  Assert.string(scheme)
  Assert.string(query)
  throw new Error('not implemented')
}
