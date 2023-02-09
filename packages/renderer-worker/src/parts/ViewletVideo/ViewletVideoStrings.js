import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  FailedToLoadVideo: `Failed to load video: {PH1}`,
}

export const failedToLoadVideo = (message) => {
  return I18nString.i18nString(UiStrings.FailedToLoadVideo, {
    PH1: message,
  })
}
