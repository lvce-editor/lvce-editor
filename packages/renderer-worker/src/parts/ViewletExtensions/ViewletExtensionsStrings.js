import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  NoExtensionsFound: 'No extensions found.',
  Filter: 'Filter',
  Refresh: 'Refresh',
  ClearExtensionSearchResults: 'Clear extension search results',
}

export const noExtensionsFound = () => {
  return I18nString.i18nString(UiStrings.NoExtensionsFound)
}

export const filter = () => {
  return I18nString.i18nString(UiStrings.Filter)
}

export const refresh = () => {
  return I18nString.i18nString(UiStrings.Refresh)
}

export const clearExtensionSearchResults = () => {
  return I18nString.i18nString(UiStrings.ClearExtensionSearchResults)
}
