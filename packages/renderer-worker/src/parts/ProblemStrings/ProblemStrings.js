import * as I18NString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  NoProblemsDetected: 'No problems have been detected in the workspace.',
  ProblemsDetected: 'Some problems have been detected in the workspace.',
  LineColumn: '[Ln {PH1}, Col {PH2}]',
  Copy: 'Copy',
  CopyMessage: 'Copy Message',
  Code: 'Code',
  Message: 'Message',
  File: 'File',
  Source: 'Source',
  Filter: 'Filter',
  ShowingOfItems: 'Showing {PH1} of {PH2} ',
}

export const noProblemsDetected = () => {
  return I18NString.i18nString(UiStrings.NoProblemsDetected)
}

export const getMessage = (problemsCount) => {
  if (problemsCount === 0) {
    return I18NString.i18nString(UiStrings.NoProblemsDetected)
  }
  return I18NString.i18nString(UiStrings.ProblemsDetected)
}

export const atLineColumn = (line, column) => {
  return I18NString.i18nString(UiStrings.LineColumn, {
    PH1: line,
    PH2: column,
  })
}

export const copy = () => {
  return I18NString.i18nString(UiStrings.Copy)
}

export const code = () => {
  return I18NString.i18nString(UiStrings.Code)
}

export const message = () => {
  return I18NString.i18nString(UiStrings.Message)
}

export const file = () => {
  return I18NString.i18nString(UiStrings.File)
}

export const filter = () => {
  return I18NString.i18nString(UiStrings.Filter)
}

export const showingOf = (visibleCount, totalCount) => {
  return I18NString.i18nString(UiStrings.ShowingOfItems, {
    PH1: visibleCount,
    PH2: totalCount,
  })
}

export const source = () => {
  return I18NString.i18nString(UiStrings.Source)
}

export const copyMessage = () => {
  return I18NString.i18nString(UiStrings.CopyMessage)
}
