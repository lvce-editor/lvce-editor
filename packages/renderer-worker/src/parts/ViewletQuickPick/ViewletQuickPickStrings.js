import * as I18NString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Files: 'Files',
  GoToFile: 'Go to file',
  NoMatchingColorThemesFound: 'No matching color themes found',
  NoMatchingResults: 'No matching results',
  NoRecentlyOpenedFoldersFound: 'No recently opened folders found',
  NoResults: 'No Results',
  NoSymbolFound: 'No symbol found',
  NoWorkspaceSymbolsFound: 'no workspace symbols found',
  OpenRecent: 'Open Recent',
  SelectColorTheme: 'Select Color Theme',
  SelectToOpen: 'Select to open',
  ShowAndRunCommands: 'Show And Run Commands',
  TypeNameOfCommandToRun: 'Type the name of a command to run.',
  TypeTheNameOfAViewToOpen: 'Type the name of a view, output channel or terminal to open.',
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

export const noResults = () => {
  return I18NString.i18nString(UiStrings.NoResults)
}

export const selectToOpen = () => {
  return I18NString.i18nString(UiStrings.SelectToOpen)
}

export const openRecent = () => {
  return I18NString.i18nString(UiStrings.OpenRecent)
}

export const noRecentlyOpenedFoldersFound = () => {
  return I18NString.i18nString(UiStrings.NoRecentlyOpenedFoldersFound)
}

export const noSymbolFound = () => {
  return I18NString.i18nString(UiStrings.NoSymbolFound)
}

export const noWorkspaceSymbolsFound = () => {
  return I18NString.i18nString(UiStrings.NoWorkspaceSymbolsFound)
}

export const typeTheNameOfAViewToOpen = () => {
  return I18NString.i18nString(UiStrings.TypeTheNameOfAViewToOpen)
}
