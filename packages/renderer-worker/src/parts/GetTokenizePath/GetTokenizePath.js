import * as Languages from '../Languages/Languages.js'

export const getTokenizePath = (languageId) => {
  const tokenizePath = Languages.getTokenizeFunctionPath(languageId)
  return tokenizePath
}
