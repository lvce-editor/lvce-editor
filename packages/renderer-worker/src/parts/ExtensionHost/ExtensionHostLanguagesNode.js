import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getLanguages = async () => {
  // TODO handle error
  const languages = await SharedProcess.invoke(
    /* ExtensionHostLanguages.getLanguages */ 'ExtensionHostLanguages.getLanguages'
  )
  return languages
}

export const getLanguageConfiguration = async (languageId) => {
  const languageConfiguration = await SharedProcess.invoke(
    /* ExtensionHostLanguages.getLanguageConfiguration */ 'ExtensionHostLanguages.getLanguageConfiguration',
    /* languageId */ languageId
  )
  return languageConfiguration
}
