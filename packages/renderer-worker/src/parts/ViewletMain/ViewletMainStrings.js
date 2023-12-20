import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  OpenFile: 'Open File',
  SplitUp: 'Split Up',
  SplitDown: 'Split Down',
  SplitLeft: 'Split Left',
  SplitRight: 'Split Right',
  NewWindow: 'New Window',
}

export const openFile = () => {
  return I18nString.i18nString(UiStrings.OpenFile)
}

export const splitUp = () => {
  return I18nString.i18nString(UiStrings.SplitUp)
}

export const splitDown = () => {
  return I18nString.i18nString(UiStrings.SplitDown)
}

export const splitLeft = () => {
  return I18nString.i18nString(UiStrings.SplitLeft)
}

export const splitRight = () => {
  return I18nString.i18nString(UiStrings.SplitRight)
}

export const newWindow = () => {
  return I18nString.i18nString(UiStrings.NewWindow)
}
