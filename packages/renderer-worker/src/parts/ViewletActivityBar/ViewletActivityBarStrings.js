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
  ActivityBar: 'Activity Bar',
  Seperator: 'Separator',
  MoveSideBarLeft: 'Move Side Bar Left',
  MoveSideBarRight: 'Move Side Bar Right',
  HideActivityBar: 'Hide Activity Bar',
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

export const activityBar = () => {
  return I18nString.i18nString(UiStrings.ActivityBar)
}

export const moveSideBarRight = () => {
  return I18nString.i18nString(UiStrings.MoveSideBarRight)
}

export const moveSideBarLeft = () => {
  return I18nString.i18nString(UiStrings.MoveSideBarLeft)
}

export const separator = () => {
  return I18nString.i18nString(UiStrings.Seperator)
}

export const hideActivityBar = () => {
  return I18nString.i18nString(UiStrings.HideActivityBar)
}
