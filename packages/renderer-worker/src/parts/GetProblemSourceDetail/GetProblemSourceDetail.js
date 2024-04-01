// TODO compute detail message in getVisibleProblems
export const getProblemSourceDetail = (source, code) => {
  let message = ''
  if (source) {
    message += `${source}`
  }
  if (code) {
    message += `(${code})`
  }
  message += ' '
  return message
}
