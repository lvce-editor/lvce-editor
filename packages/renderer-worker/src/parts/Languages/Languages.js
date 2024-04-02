// TODO merge all of this with extension host languages module

import * as Assert from '../Assert/Assert.ts'
import * as CodeFrameColumns from '../CodeFrameColumns/CodeFrameColumns.js'
import * as ExtensionHostLanguages from '../ExtensionHost/ExtensionHostLanguages.js'
import * as GetFileExtension from '../GetFileExtension/GetFileExtension.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as LanguagesState from '../LanguagesState/LanguagesState.js'
import * as Logger from '../Logger/Logger.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as SplitLines from '../SplitLines/SplitLines.js'

export const getLanguageId = (fileName) => {
  Assert.string(fileName)
  // TODO this is inefficient for icon theme, as file extension is computed twice
  const extensionIndex = GetFileExtension.getFileExtensionIndex(fileName)
  const extension = fileName.slice(extensionIndex)
  const extensionLower = extension.toLowerCase()
  if (LanguagesState.hasLanguageByExtension(extensionLower)) {
    return LanguagesState.getLanguageByExtension(extensionLower)
  }
  const fileNameLower = fileName.toLowerCase()
  const secondExtensionIndex = GetFileExtension.getNthFileExtension(fileName, extensionIndex - 1)
  const secondExtension = fileName.slice(secondExtensionIndex)
  if (secondExtensionIndex !== -1 && LanguagesState.hasLanguageByExtension(secondExtension)) {
    return LanguagesState.getLanguageByExtension(secondExtension)
  }
  if (LanguagesState.hasLanguageByFileName(fileNameLower)) {
    return LanguagesState.getLanguageByFileName(fileNameLower)
  }
  return 'unknown'
}

export const getLanguageIdByFirstLine = (firstLine) => {
  const firstLines = LanguagesState.getFirstLines()
  for (const { regex, languageId } of firstLines) {
    const actualRegex = new RegExp(regex)
    if (actualRegex.test(firstLine)) {
      return languageId
    }
  }
  return 'unknown'
}

export const getTokenizeFunctionPath = (languageId) => {
  // TODO what if language.tokenize is not of type string? -> handle error gracefully
  return LanguagesState.getTokenizeFunctionPath(languageId)
}

export const hydrate = async () => {
  LanguagesState.setHydrating(true)
  // TODO handle error
  // TODO main parts should have nothing todo with shared process -> only sub components
  const languages = await ExtensionHostLanguages.getLanguages()
  // TODO avoid side effect here, but how?
  await addLanguages(languages)
  const useJsx = Preferences.get('languages.jsFilesAsJsx')
  if (useJsx) {
    LanguagesState.addExtension('.js', 'jsx')
  }
  LanguagesState.setLoaded(true)
}

// TODO make contribution points not rely on globals and side effects
const contributionPointFileExtensions = {
  key: 'fileExtensions',
  handle(value, languageId) {
    if (value) {
      Logger.warn(`[renderer-worker] unsupported property "fileExtensions" for language ${languageId}, use the property "extensions" instead`)
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
          LanguagesState.addFileName(fileNameLower, languageId)
        } else {
          Logger.warn(`[renderer-worker] language.fileNames for ${languageId} should be an array of strings but includes ${typeof fileName}`)
        }
      }
    }
  },
}

const contributionPointFirstLine = {
  key: 'firstLine',
  handle(value, languageId) {
    LanguagesState.addFirstLine(value, languageId)
  },
}

const warnFileNames = (languageId, language) => {
  if (LanguagesState.hasWarned(languageId)) {
    return
  }
  LanguagesState.addWarned(languageId)
  const code = JSON.stringify(language, null, 2)
  const lines = SplitLines.splitLines(code)
  let rowIndex = 0
  let columnIndex = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const fileNamesIndex = line.indexOf('filenames')
    if (fileNamesIndex !== -1) {
      rowIndex = i
      columnIndex = fileNamesIndex
      break
    }
  }
  const codeFrame = CodeFrameColumns.create(code, {
    start: {
      line: rowIndex + 1,
      column: columnIndex + 1,
    },
    end: {
      line: rowIndex + 1,
      column: columnIndex + 'filenames'.length + 1,
    },
  })
  Logger.warn(
    `Please use "fileNames" instead of "filenames" for language ${languageId}
${codeFrame}
`,
  )
}

const contributionPointFileNamesLower = {
  key: 'filenames',
  handle(value, languageId, language) {
    warnFileNames(languageId, language)
    contributionPointFileNames.handle(value, languageId)
  },
}

const contributionPointExtensions = {
  key: 'extensions',
  handle(value, languageId) {
    if (value && Array.isArray(value)) {
      for (const extension of value) {
        if (typeof extension === 'string') {
          LanguagesState.addExtension(extension, languageId)
        } else {
          Logger.warn(`[renderer-worker] language.extensions for ${languageId} should be an array of strings but includes ${typeof extension}`)
        }
      }
    }
  },
}

const contributionPointTokenize = {
  key: 'tokenize',
  handle(value, languageId) {
    if (value) {
      LanguagesState.addTokenizer(languageId, value)
    }
  },
}

const contributionPoints = [
  contributionPointFileExtensions,
  contributionPointExtensions,
  contributionPointFileNames,
  contributionPointFileNamesLower,
  contributionPointTokenize,
  contributionPointFirstLine,
]

export const addLanguage = (language) => {
  const languageId = language.id
  if (!languageId) {
    Logger.warn('[renderer-worker] language is missing id', language)
    return
  }
  // TODO could use object destructuing here
  // TODO maybe map the other way around from language keys to contribution points
  for (const contributionPoint of contributionPoints) {
    const value = language[contributionPoint.key]
    if (value) {
      contributionPoint.handle(value, languageId, language)
    }
  }
}

export const addLanguages = async (languages) => {
  for (const language of languages) {
    addLanguage(language)
  }
  await GlobalEventBus.emitEvent('languages.changed')
}

export const hasLoaded = () => {
  return LanguagesState.hasLoaded()
}

export const waitForLoad = async () => {
  // if (state.isHydrating) {
  await new Promise((resolve) => {
    const handleLanguageChange = (editor, languageId) => {
      resolve(undefined)
    }
    // TODO remove event listener when promise is resolved
    // TODO what if this event is never emitted (e.g. languages fail to load)
    GlobalEventBus.addListener('languages.changed', handleLanguageChange)
  })
  // } else {
  //   await hydrate()
  // }
}

export const getLanguageConfiguration = async (editor) => {
  if (!hasLoaded()) {
    throw new Error('languages must be loaded before requesting language configuration')
  }
  try {
    editor.languageId = getLanguageId(editor.uri)
    const languageConfiguration = await ExtensionHostLanguages.getLanguageConfiguration(editor.languageId)
    return languageConfiguration
  } catch (error) {
    Logger.error(error)
    return {}
  }
}
