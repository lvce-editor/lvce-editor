import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import VError from 'verror'
import * as Error from '../Error/Error.js'
import * as ExtensionManagement from './ExtensionManagement.js'
import * as ReadJson from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'

const getExtensionLanguages = (extension) => {
  if (!extension.languages) {
    return []
  }
  return extension.languages.map((language) => ({}))
}

const toRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const getLanguagesFromExtension = (extension) => {
  // TODO what if extension is null? should not crash process, handle error gracefully
  if (!extension.languages) {
    return []
  }
  const getLanguageFromExtension = (language) => {
    if (language.tokenize) {
      if (typeof language.tokenize !== 'string') {
        console.warn(
          `[info] ${
            language.id
          }: language.tokenize must be of type string but was of type ${typeof language.tokenize}`
        )
        return {
          ...language,
          tokenize: '',
        }
      }
      return {
        ...language,
        tokenize: toRemoteUrl(join(extension.path, language.tokenize)),
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
    const languageConfigurationPath =
      getLanguageConfigurationPathFromExtensions(extensions, languageId)
    return await ReadJson.readJson(languageConfigurationPath)
  } catch (error) {
    throw new VError(
      error,
      `Failed to load language configuration for ${languageId}`
    )
  }
}
