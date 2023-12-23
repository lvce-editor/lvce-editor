import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  About: 'About',
  ToggleDeveloperTools: 'Toggle Developer Tools',
  OpenProcessExplorer: 'Open Process Explorer',
  CheckForUpdates: 'Check For Updates',
}

export const toggleDeveloperTools = () => {
  return I18nString.i18nString(UiStrings.ToggleDeveloperTools)
}

export const openProcessExplorer = () => {
  return I18nString.i18nString(UiStrings.OpenProcessExplorer)
}

export const checkForUpdates = () => {
  return I18nString.i18nString(UiStrings.CheckForUpdates)
}

export const about = () => {
  return I18nString.i18nString(UiStrings.About)
}
