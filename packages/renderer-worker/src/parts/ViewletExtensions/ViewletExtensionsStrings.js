import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  NoExtensionsFound: 'No extensions found',
}

export const noExtensionsFound = () => {
  return I18nString.i18nString(UiStrings.NoExtensionsFound)
}
