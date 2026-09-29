export const getPathName = (request: any): any => {
  const { pathname } = new URL(request.url || '', `https://${request.headers.host}`)
  return pathname
}
