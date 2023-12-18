import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  File: 'File',
  Edit: 'Edit',
  Selection: 'Selection',
  View: 'View',
  Go: 'Go',
  Run: 'Run',
  Terminal: 'Terminal',
  Help: 'Help',
}

export const file = () => {
  return I18nString.i18nString(UiStrings.File)
}

export const edit = () => {
  return I18nString.i18nString(UiStrings.Edit)
}

export const selection = () => {
  return I18nString.i18nString(UiStrings.Selection)
}

export const view = () => {
  return I18nString.i18nString(UiStrings.View)
}

export const go = () => {
  return I18nString.i18nString(UiStrings.Go)
}

export const run = () => {
  return I18nString.i18nString(UiStrings.Run)
}

export const terminal = () => {
  return I18nString.i18nString(UiStrings.Terminal)
}

export const help = () => {
  return I18nString.i18nString(UiStrings.Help)
}
