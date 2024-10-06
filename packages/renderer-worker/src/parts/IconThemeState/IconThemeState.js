import * as InitialIconTheme from '../InitialIconTheme/InitialIconTheme.js'

export const state = {
  seenFiles: [],
  seenFolders: [],
  hasWarned: [],
  /**
   * @type{any}
   */
  iconTheme: InitialIconTheme.initialIconTheme,
  extensionPath: '',
}

export const setTheme = (iconTheme) => {
  state.iconTheme = iconTheme.json
  state.extensionPath = iconTheme.extensionPath
}

export const getExtensionPath = () => {
  return state.extensionPath || ''
}

export const getIconTheme = () => {
  return state.iconTheme
}
