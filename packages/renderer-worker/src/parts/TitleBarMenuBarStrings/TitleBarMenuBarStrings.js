import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  More: 'more',
}

export const more = () => {
  return I18nString.i18nString(UiStrings.More)
}
