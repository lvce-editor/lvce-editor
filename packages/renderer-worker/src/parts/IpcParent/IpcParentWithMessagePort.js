export const create = async ({ url, name }) => {
  const port = await new Promise((resolve) => {
    globalThis.acceptPort = resolve
    import(url)
  })
  delete globalThis.acceptPort
  return port
}
