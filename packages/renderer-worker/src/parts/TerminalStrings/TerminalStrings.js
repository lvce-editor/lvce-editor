import * as I18NString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  SplitTerminal: 'Split Terminal',
  KillTerminal: 'Kill Terminal',
  NewTerminal: 'New Terminal',
}

export const splitTerminal = () => {
  return I18NString.i18nString(UiStrings.SplitTerminal)
}

export const killTerminal = () => {
  return I18NString.i18nString(UiStrings.KillTerminal)
}

export const newTerminal = () => {
  return I18NString.i18nString(UiStrings.NewTerminal)
}
