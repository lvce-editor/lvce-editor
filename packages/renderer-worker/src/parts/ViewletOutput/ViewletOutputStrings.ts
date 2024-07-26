import * as I18NString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Output: 'output',
  ClearOutput: 'clear output',
  TurnOffAutoScroll: 'Turn auto scrolling off',
  OpenLogFile: 'open output log file',
}

export const output = () => {
  return I18NString.i18nString(UiStrings.Output)
}

export const clearOutput = () => {
  return I18NString.i18nString(UiStrings.ClearOutput)
}

export const turnOffAutoScroll = () => {
  return I18NString.i18nString(UiStrings.TurnOffAutoScroll)
}

export const openLogFile = () => {
  return I18NString.i18nString(UiStrings.OpenLogFile)
}
