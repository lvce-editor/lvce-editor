import * as I18NString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  DoYouWantToUpdate: 'Do you want to update to version {PH1}?',
  DoYouWantToRestart: 'The Update has been downloaded. Do you want to restart now?',
}

export const promptMessage = (version) => {
  return I18NString.i18nString(UiStrings.DoYouWantToUpdate, { PH1: version })
}

export const promptRestart = () => {
  return I18NString.i18nString(UiStrings.DoYouWantToRestart)
}
