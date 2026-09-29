import * as LanguagesState from '../LanguagesState/LanguagesState.js'

export const getTokenizePath = (languageId) => {
  const tokenizePath = LanguagesState.getTokenizeFunctionPath(languageId)
  return tokenizePath
}
