// TODO merge all of this with extension host languages module

import * as Assert from '../Assert/Assert.js'
import * as ExtensionHostLanguages from '../ExtensionHost/ExtensionHostLanguages.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'

export const state = {
  languages: [],
  loadState: false,
  isHydrating: false,
}

export const getLanguageId = (path) => {
  Assert.string(path)
  const extension = path.slice(path.lastIndexOf('.'))
  for (const language of state.languages) {
    if (language.extensions && language.extensions.includes(extension)) {
      return language.id
    }
  }
  return 'unknown'
}

export const getTokenizeFunctionPath = (languageId) => {
  for (const language of state.languages) {
    if (language.id === languageId && language.tokenize) {
      // TODO what if language.tokenize is not of type string? -> handle error gracefully
      return language.tokenize
    }
  }
  return ''
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

export const addLanguages = async (languages) => {
  // @ts-ignore
  state.languages.push(...languages)
  await GlobalEventBus.emitEvent('languages.changed')
}

export const hasLoaded = () => {
  return state.loaded
}

export const waitForLoad = async () => {
  if (state.isHydrating) {
    await new Promise((resolve) => {
      const handleLanguageChange = (editor, languageId) => {
        resolve()
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
