import * as I18NString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  NoMatchingColorThemesFound: 'No matching color themes found',
  SelectColorTheme: 'Select Color Theme',
}

export const noMatchingColorThemesFound = () => {
  return I18NString.i18nString(UiStrings.NoMatchingColorThemesFound)
}

export const selectColorTheme = () => {
  return I18NString.i18nString(UiStrings.SelectColorTheme)
}
