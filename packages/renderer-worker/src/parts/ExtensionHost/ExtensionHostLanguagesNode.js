import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Command from '../Command/Command.js'

export const getLanguages = async () => {
  // TODO handle error
  const languages = await SharedProcess.invoke(/* ExtensionHost.getLanguages */ 'ExtensionHost.getLanguages')
  return languages
}

const joinPath = (extensionPath, relativePath) => {
  if (relativePath.startsWith('./')) {
    return extensionPath + relativePath.slice(1)
  }
  return extensionPath + relativePath
}

const getLanguageConfigurationPathFromExtensions = (extensions, languageId) => {
  for (const extension of extensions) {
    if (extension && extension.languages && Array.isArray(extension.languages)) {
      for (const language of extension.languages) {
        if (language && language.id === languageId && language.configuration) {
          const path = joinPath(extension.path, language.configuration)
          return path
        }
      }
    }
  }
  return ''
}

const getLanguageConfigurationFromWebExtension = async (languageId) => {
  const languageConfigurationPath = getLanguageConfigurationPathFromExtensions(ExtensionMeta.state.webExtensions, languageId)
  if (!languageConfigurationPath) {
    return undefined
  }
  const json = await Command.execute('Ajax.getJson', languageConfigurationPath)
  return json
}

export const getLanguageConfiguration = async (languageId) => {
  const languageConfiguration = await SharedProcess.invoke(
    /* ExtensionHost.getLanguageConfiguration */ 'ExtensionHost.getLanguageConfiguration',
    /* languageId */ languageId
  )
  if (languageConfiguration) {
    return languageConfiguration
  }
  return getLanguageConfigurationFromWebExtension(languageId)
}
