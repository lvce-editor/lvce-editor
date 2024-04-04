import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  ImageCouldNotBeLoaded: 'Image could not be loaded',
  ImageNotFound: 'Image could not be loaded: Not Found',
  Copy: 'Copy',
  CopyPath: 'Copy Path',
}

export const imageCouldNotBeLoaded = () => {
  return I18nString.i18nString(UiStrings.ImageCouldNotBeLoaded)
}

export const imageNotFound = () => {
  return I18nString.i18nString(UiStrings.ImageNotFound)
}

export const copy = () => {
  return I18nString.i18nString(UiStrings.Copy)
}

export const copyPath = () => {
  return I18nString.i18nString(UiStrings.CopyPath)
}
