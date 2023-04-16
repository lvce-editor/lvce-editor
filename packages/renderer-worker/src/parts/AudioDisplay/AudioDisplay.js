import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  FailedToLoadAudio: `Failed to load audio: {PH1}`,
}

export const getImprovedErrorMessage = (message) => {
  return I18nString.i18nString(UiStrings.FailedToLoadAudio, {
    PH1: message,
  })
}
