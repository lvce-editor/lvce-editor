import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  InspectElement: 'Inspect Element',
  Cut: 'Cut',
  Copy: 'Copy',
  Paste: 'Paste',
  OpenLinkInNewTab: 'Open Link in New Tab',
  CopyLinkAddress: 'Copy Link Address',
  SaveImageAs: 'Save Image',
  CopyImage: 'Copy Image',
}

export const inspectElement = () => {
  return I18nString.i18nString(UiStrings.InspectElement)
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

export const openLinkInNewTab = () => {
  return I18nString.i18nString(UiStrings.OpenLinkInNewTab)
}

export const copyLinkAddress = () => {
  return I18nString.i18nString(UiStrings.CopyLinkAddress)
}

export const saveImageAs = () => {
  return I18nString.i18nString(UiStrings.SaveImageAs)
}

export const copyImage = () => {
  return I18nString.i18nString(UiStrings.CopyImage)
}
