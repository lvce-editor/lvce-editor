import * as I18NString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Cancel: 'Cancel',
  Ok: 'Ok',
}

export const cancel = () => {
  return I18NString.i18nString(UiStrings.Cancel)
}

export const ok = () => {
  return I18NString.i18nString(UiStrings.Ok)
}
