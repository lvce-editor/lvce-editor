import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  OpenFile: 'Open File',
}

export const openFile = () => {
  return I18nString.i18nString(UiStrings.OpenFile)
}
