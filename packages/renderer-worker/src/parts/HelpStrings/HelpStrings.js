import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  About: 'About',
  CheckForUpdates: 'Check For Updates',
  ColorTheme: 'Color Theme',
  CommandPalette: 'Command Palette',
  KeyboardShortcuts: 'Keyboard Shortcuts',
  OpenProcessExplorer: 'Open Process Explorer',
  Settings: 'Settings',
  ToggleDeveloperTools: 'Toggle Developer Tools',
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

export const commandPalette = () => {
  return I18nString.i18nString(UiStrings.CommandPalette)
}

export const settings = () => {
  return I18nString.i18nString(UiStrings.Settings)
}

export const keyboardShortcuts = () => {
  return I18nString.i18nString(UiStrings.KeyboardShortcuts)
}

export const colorTheme = () => {
  return I18nString.i18nString(UiStrings.ColorTheme)
}
