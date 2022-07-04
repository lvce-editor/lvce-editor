export const create = async (url) => {
  console.log({ url })
  await import(url)
  // const port = await new Promise((resolve) => {
  //   globalThis.acceptPort = resolve
  //   import(url)
  // })
  // delete globalThis.acceptPort
  // return port
}
