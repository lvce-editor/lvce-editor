import * as I18NString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  References: 'References',
}

export const getDisplayName = () => {
  return I18NString.i18nString(UiStrings.References)
}
