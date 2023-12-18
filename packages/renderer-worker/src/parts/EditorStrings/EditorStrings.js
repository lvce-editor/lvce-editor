import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  GoToTypeDefinition: 'Go to Type Definition',
  GoToDefinition: 'Go to Definition',
  FindAllReferences: 'Find All References',
  FindAllImplementations: 'Find All Implementations',
  Cut: 'Cut',
  Copy: 'Copy',
  Paste: 'Paste',
}

export const goToDefinition = () => {
  return I18nString.i18nString(UiStrings.GoToDefinition)
}

export const goToTypeDefinition = () => {
  return I18nString.i18nString(UiStrings.GoToTypeDefinition)
}

export const findAllReferences = () => {
  return I18nString.i18nString(UiStrings.FindAllReferences)
}

export const findAllImplementations = () => {
  return I18nString.i18nString(UiStrings.FindAllImplementations)
}

export const cut = () => {
  return I18nString.i18nString(UiStrings.Cut)
}

export const copy = () => {
  return I18nString.i18nString(UiStrings.Copy)
}

export const paste = () => {
  return I18nString.i18nString(UiStrings.Paste)
}
