// TODO rename file to languageConfiguration.js
import { join } from 'node:path'
import * as GetRemoteUrl from '../GetRemoteUrl/GetRemoteUrl.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import { VError } from '../VError/VError.js'
import * as ExtensionManagement from './ExtensionManagement.js'

const getLanguagesFromExtension = (extension) => {
  // TODO what if extension is null? should not crash process, handle error gracefully
  if (!extension.languages) {
    return []
  }
  const extensionPath = extension.path
  const getLanguageFromExtension = (language) => {
    if (language.tokenize) {
      if (typeof language.tokenize !== 'string') {
        console.warn(`[info] ${language.id}: language.tokenize must be of type string but was of type ${typeof language.tokenize}`)
        return {
          ...language,
          extensionPath,
          tokenize: '',
        }
      }
      return {
        ...language,
        extensionPath,
        tokenize: GetRemoteUrl.getRemoteUrl(join(extensionPath, language.tokenize)),
      }
    }
    return language
  }
  return extension.languages.map(getLanguageFromExtension)
}

const getLanguagesFromExtensions = (extensions) => {
  return extensions.flatMap(getLanguagesFromExtension)
}

export const getLanguages = async () => {
  const extensions = await ExtensionManagement.getExtensions()
  const languages = getLanguagesFromExtensions(extensions)
  return languages
}

const getLanguageConfigurationPathFromExtensions = (extensions, languageId) => {
  for (const extension of extensions) {
    if (extension.languages && extension.languages) {
      for (const language of extension.languages) {
        if (language.id === languageId && language.configuration) {
          return join(extension.path, language.configuration)
        }
      }
    }
  }
  return ''
}

export const getLanguageConfiguration = async (languageId) => {
  try {
    const extensions = await ExtensionManagement.getExtensions()
    const languageConfigurationPath = getLanguageConfigurationPathFromExtensions(extensions, languageId)
    if (!languageConfigurationPath) {
      return undefined
    }
    return await JsonFile.readJson(languageConfigurationPath)
  } catch (error) {
    throw new VError(error, `Failed to load language configuration for ${languageId}`)
  }
}
