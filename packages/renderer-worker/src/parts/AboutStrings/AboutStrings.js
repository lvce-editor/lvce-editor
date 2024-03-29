import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Ok: 'Ok',
  Copy: 'Copy',
  Version: 'Version',
  Commit: 'Commit',
  Date: 'Date',
  Browser: 'Browser',
  Info: 'Info',
  Close: 'Close',
  CloseDialog: 'Close Dialog',
}

export const ok = () => {
  return I18nString.i18nString(UiStrings.Ok)
}

export const copy = () => {
  return I18nString.i18nString(UiStrings.Copy)
}

export const version = () => {
  return I18nString.i18nString(UiStrings.Version)
}

export const commit = () => {
  return I18nString.i18nString(UiStrings.Commit)
}

export const date = () => {
  return I18nString.i18nString(UiStrings.Date)
}

export const browser = () => {
  return I18nString.i18nString(UiStrings.Browser)
}

export const info = () => {
  return I18nString.i18nString(UiStrings.Info)
}

export const close = () => {
  return I18nString.i18nString(UiStrings.Close)
}

export const closeDialog = () => {
  return I18nString.i18nString(UiStrings.CloseDialog)
}
