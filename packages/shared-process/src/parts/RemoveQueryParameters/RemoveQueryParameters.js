export const removeQueryParameters = (url) => {
  const questionIndex = url.indexOf('?')
  if (questionIndex === -1) {
    return url
  }
  return url.slice(0, questionIndex)
}
