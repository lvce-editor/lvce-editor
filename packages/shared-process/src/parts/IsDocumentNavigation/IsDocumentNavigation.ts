export const isDocumentNavigation = (request: any): boolean => {
  const headers = request?.headers
  return headers?.['sec-fetch-dest'] === 'document' || headers?.['sec-fetch-mode'] === 'navigate'
}
