export const pathToFileUri = (path) => {
  const url = new URL('file:///')
  url.pathname = path.replaceAll('\\', '/').replaceAll('%', '%25')
  return url.toString()
}
