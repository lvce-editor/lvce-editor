import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  More: 'more',
  MoreDot: 'More ...',
  ClearRecentlyOpened: 'Clear Recently Opened',
}

export const more = () => {
  return I18nString.i18nString(UiStrings.More)
}

export const moreDot = () => {
  return I18nString.i18nString(UiStrings.MoreDot)
}

export const clearRecentlyOpened = () => {
  return I18nString.i18nString(UiStrings.ClearRecentlyOpened)
}
