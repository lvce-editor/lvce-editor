export const create = async (url) => {
  const port = await new Promise((resolve) => {
    globalThis.acceptPort = resolve
    import(url)
  })
  delete globalThis.acceptPort
  return port
}
