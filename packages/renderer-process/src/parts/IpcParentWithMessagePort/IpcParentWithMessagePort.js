import * as Assert from '../Assert/Assert.js'

export const create = async ({ url }) => {
  Assert.string(url)
  const port = await new Promise((resolve) => {
    globalThis.acceptPort = resolve
    import(url)
  })
  delete globalThis.acceptPort
  return port
}
