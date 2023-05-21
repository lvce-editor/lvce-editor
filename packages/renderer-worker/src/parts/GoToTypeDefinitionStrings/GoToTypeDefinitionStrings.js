import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  NoTypeDefinitionFound: 'No type definition found',
  NoTypeDefinitionFoundFor: `No type definition found for '{PH1}'`,
}

export const getNoLocationFoundMessage = (info) => {
  if (info.word) {
    return I18nString.i18nString(UiStrings.NoTypeDefinitionFoundFor, {
      PH1: info.word,
    })
  }
  return I18nString.i18nString(UiStrings.NoTypeDefinitionFound)
}
