import * as I18NString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Refresh: 'Refresh',
  Clear: 'Clear',
  CollapseAll: 'Collapse All',
}

export const refresh = () => {
  return I18NString.i18nString(UiStrings.Refresh)
}

export const clear = () => {
  return I18NString.i18nString(UiStrings.Clear)
}

export const collapseAll = () => {
  return I18NString.i18nString(UiStrings.CollapseAll)
}
