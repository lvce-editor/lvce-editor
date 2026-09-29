export const removeQueryParameters = (url: any): any => {
  const questionIndex = url.indexOf('?')
  if (questionIndex === -1) {
    return url
  }
  return url.slice(0, questionIndex)
}
