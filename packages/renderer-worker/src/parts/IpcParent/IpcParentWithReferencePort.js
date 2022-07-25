export const create = async ({ url }) => {
  const referencePort = await new Promise((resolve) => {
    globalThis.acceptReferencePort = resolve
    import(url)
  })
  delete globalThis.acceptReferencePort
  return referencePort
}
