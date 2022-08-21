// TODO merge all of this with extension host languages module

import * as Assert from '../Assert/Assert.js'
import * as ExtensionHostLanguages from '../ExtensionHost/ExtensionHostLanguages.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'

export const state = {
  loadState: false,
  isHydrating: false,
  fileNameMap: Object.create(null),
  extensionMap: Object.create(null),
  tokenizerMap: Object.create(null),
}

export const getLanguageId = (fileName) => {
  Assert.string(fileName)
  // TODO this is inefficient for icon theme, as file extension is computed twice
  const extension = fileName.slice(fileName.lastIndexOf('.'))
  const fileNameLower = fileName.toLowerCase()
  const { extensionMap, fileNameMap } = state
  if (extensionMap[extension]) {
    return extensionMap[extension]
  }
  if (fileNameMap[fileNameLower]) {
    return fileNameMap[fileNameLower]
  }
  return 'unknown'
}

export const getTokenizeFunctionPath = (languageId) => {
  // TODO what if language.tokenize is not of type string? -> handle error gracefully
  return state.tokenizerMap[languageId] || ''
}

const getLanguages = () => {
  // TODO handle error

  return ExtensionHostLanguages.getLanguages()
}

export const hydrate = async () => {
  state.isHydrating = true
  // TODO handle error
  // TODO main parts should have nothing todo with shared process -> only sub components
  const languages = await getLanguages()
  // TODO avoid side effect here, but how?
  await addLanguages(languages)
  state.loaded = true
}

// TODO make contribution points not rely on globals and side effects
const contributionPointFileExtensions = {
  key: 'fileExtensions',
  handle(value, languageId) {
    if (value) {
      console.warn(
        `[renderer-worker] unsupported property "fileExtensions" for language ${language.id}, use the property "extensions" instead`
      )
    }
  },
}

const contributionPointFileNames = {
  key: 'fileNames',
  handle(value, languageId) {
    if (value && Array.isArray(value)) {
      for (const fileName of value) {
        if (typeof fileName === 'string') {
          const fileNameLower = fileName.toLowerCase()
          state.fileNameMap[fileNameLower] = languageId
        } else {
          console.warn(
            `[renderer-worker] language.fileNames for ${languageId} should be an array of strings but includes ${typeof fileName}`
          )
        }
      }
      state.fileNameMap
    }
  },
}

const contributionPointExtensions = {
  key: 'extensions',
  handle(value, languageId) {
    if (value && Array.isArray(value)) {
      for (const extension of value) {
        if (typeof extension === 'string') {
          state.extensionMap[extension] = languageId
        } else {
          console.warn(
            `[renderer-worker] language.extensions for ${languageId} should be an array of strings but includes ${typeof extension}`
          )
        }
      }
    }
  },
}

const contributionPointTokenize = {
  key: 'tokenize',
  handle(value, languageId) {
    if (value) {
      state.tokenizerMap[languageId] = value
    }
  },
}

const contributionPoints = [
  contributionPointFileExtensions,
  contributionPointExtensions,
  contributionPointFileNames,
  contributionPointTokenize,
]

const addLanguage = (language) => {
  const languageId = language.id
  if (!languageId) {
    console.warn(`[renderer-worker] language is missing id`, language)
    return
  }
  // TODO could use object destructuing here
  for (const contributionPoint of contributionPoints) {
    const value = language[contributionPoint.key]
    contributionPoint.handle(value, languageId)
  }
}

export const addLanguages = async (languages) => {
  for (const language of languages) {
    addLanguage(language)
  }
  await GlobalEventBus.emitEvent('languages.changed')
}

export const hasLoaded = () => {
  return state.loaded
}

export const waitForLoad = async () => {
  if (state.isHydrating) {
    await new Promise((resolve) => {
      const handleLanguageChange = (editor, languageId) => {
        resolve(undefined)
      }
      // TODO remove event listener when promise is resolved
      // TODO what if this event is never emitted (e.g. languages fail to load)
      GlobalEventBus.addListener('languages.changed', handleLanguageChange)
    })
  } else {
    await hydrate()
  }
}

export const getLanguageConfiguration = async (editor) => {
  if (!hasLoaded()) {
    throw new Error(
      'languages must be loaded before requesting language configuration'
    )
  }
  editor.languageId = getLanguageId(editor.uri)
  const languageConfiguration = ExtensionHostLanguages.getLanguageConfiguration(
    editor.languageId
  )
  return languageConfiguration
}
