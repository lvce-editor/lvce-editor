import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getLanguages = async () => {
  // TODO handle error
  const languages = await SharedProcess.invoke(
    /* ExtensionHost.getLanguages */ 'ExtensionHost.getLanguages'
  )
  return languages
}

export const getLanguageConfiguration = async (languageId) => {
  const languageConfiguration = await SharedProcess.invoke(
    /* ExtensionHost.getLanguageConfiguration */ 'ExtensionHost.getLanguageConfiguration',
    /* languageId */ languageId
  )
  return languageConfiguration
}
