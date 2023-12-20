import * as I18NString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Minimize: 'Minimize',
  Maximize: 'Maximize',
  Close: 'Close',
}

export const minimize = () => {
  return I18NString.i18nString(UiStrings.Minimize)
}

export const maximize = () => {
  return I18NString.i18nString(UiStrings.Maximize)
}

export const close = () => {
  return I18NString.i18nString(UiStrings.Close)
}
