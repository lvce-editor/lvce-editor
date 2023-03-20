// TODO merge all of this with extension host languages module

import * as Assert from '../Assert/Assert.js'
import * as CodeFrameColumns from '../CodeFrameColumns/CodeFrameColumns.js'
import * as ExtensionHostLanguages from '../ExtensionHost/ExtensionHostLanguages.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Logger from '../Logger/Logger.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as SplitLines from '../SplitLines/SplitLines.js'

export const state = {
  loadState: false,
  isHydrating: false,
  fileNameMap: Object.create(null),
  extensionMap: Object.create(null),
  tokenizerMap: Object.create(null),
  /**
   * @type {any[]}
   */
  firstLines: [],
  /**
   * @type {string[]}
   */
  hasWarned: [],
}

export const getFirstLines = () => {
  return state.firstLines
}

export const hasLanguageByExtension = (extension) => {
  return extension in state.extensionMap
}

export const getLanguageByExtension = (extension) => {
  return state.extensionMap[extension]
}

export const hasLanguageByFileName = (fileName) => {
  return fileName in state.fileNameMap
}

export const getLanguageByFileName = (fileName) => {
  return state.fileNameMap[fileName]
}

export const getTokenizeFunctionPath = (languageId) => {
  // TODO what if language.tokenize is not of type string? -> handle error gracefully
  return state.tokenizerMap[languageId] || ''
}

export const setHydrating = (value) => {
  state.isHydrating = value
}

export const setLoaded = (value) => {
  state.loaded = true
}

export const addExtension = (extension, languageId) => {
  state.extensionMap[extension] = languageId
}

export const addFirstLine = (regex, languageId) => {
  state.firstLines.push({ regex, languageId })
}

export const hasWarned = (languageId) => {
  return state.hasWarned.includes(languageId)
}

export const addWarned = (languageId) => {
  return state.hasWarned.push(languageId)
}

export const addFileName = (fileName, languageId) => {
  state.fileNameMap[fileName] = languageId
}

export const addTokenizer = (languageId, tokenizer) => {
  state.tokenizerMap[languageId] = tokenizer
}

export const hasLoaded = () => {
  return state.loaded
}
