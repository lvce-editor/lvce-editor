import * as I18NString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  NoMatchingColorThemesFound: 'No matching color themes found',
  SelectColorTheme: 'Select Color Theme',
  TypeNameOfCommandToRun: 'Type the name of a command to run.',
  ShowAndRunCommands: 'Show And Run Commands',
  NoMatchingResults: 'No matching results',
  Files: 'Files',
  GoToFile: 'Go to file',
}

export const noMatchingColorThemesFound = () => {
  return I18NString.i18nString(UiStrings.NoMatchingColorThemesFound)
}

export const selectColorTheme = () => {
  return I18NString.i18nString(UiStrings.SelectColorTheme)
}

export const typeNameofCommandToRun = () => {
  return I18NString.i18nString(UiStrings.TypeNameOfCommandToRun)
}

export const showAndRunCommands = () => {
  return I18NString.i18nString(UiStrings.ShowAndRunCommands)
}

export const noMatchingResults = () => {
  return I18NString.i18nString(UiStrings.NoMatchingResults)
}

export const files = () => {
  return I18NString.i18nString(UiStrings.Files)
}

export const goToFile = () => {
  return I18NString.i18nString(UiStrings.GoToFile)
}
