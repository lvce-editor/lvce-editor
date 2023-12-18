import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  Copy: 'Copy',
  OpenInNewTab: 'Open in New Tab',
  OpenImageInNewTab: 'Open Image in New Tab',
  SaveImageAs: 'Save Image as',
}

export const copy = () => {
  return I18nString.i18nString(UiStrings.Copy)
}

export const openInNewTab = () => {
  return I18nString.i18nString(UiStrings.OpenInNewTab)
}

export const openImageInNewTab = () => {
  return I18nString.i18nString(UiStrings.OpenImageInNewTab)
}

export const saveImageAs = () => {
  return I18nString.i18nString(UiStrings.SaveImageAs)
}
