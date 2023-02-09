import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Explorer: 'Explorer',
  Search: 'Search',
  SourceControl: 'Source Control',
  RunAndDebug: 'Run and Debug',
  Extensions: 'Extensions',
  Settings: 'Settings',
  AdditionalViews: 'Additional Views',
}

export const explorer = () => {
  return I18nString.i18nString(UiStrings.Explorer)
}

export const search = () => {
  return I18nString.i18nString(UiStrings.Search)
}

export const sourceControl = () => {
  return I18nString.i18nString(UiStrings.SourceControl)
}

export const runAndDebug = () => {
  return I18nString.i18nString(UiStrings.RunAndDebug)
}

export const extensions = () => {
  return I18nString.i18nString(UiStrings.Extensions)
}

export const settings = () => {
  return I18nString.i18nString(UiStrings.Settings)
}

export const additionalViews = () => {
  return I18nString.i18nString(UiStrings.AdditionalViews)
}
