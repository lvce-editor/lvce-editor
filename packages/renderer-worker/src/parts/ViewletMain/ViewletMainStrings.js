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
  Close: 'Close',
  CloseOthers: 'Close Others',
  CloseToTheRight: 'Close To The Right',
  CloseAll: 'Close All',
  RevealInExplorer: 'Reveal in Explorer',
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

export const close = () => {
  return I18nString.i18nString(UiStrings.Close)
}

export const closeOthers = () => {
  return I18nString.i18nString(UiStrings.CloseOthers)
}

export const closeAll = () => {
  return I18nString.i18nString(UiStrings.CloseAll)
}

export const revealInExplorer = () => {
  return I18nString.i18nString(UiStrings.RevealInExplorer)
}

export const closeToTheRight = () => {
  return I18nString.i18nString(UiStrings.CloseToTheRight)
}
