import * as I18NString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  ClearFilters: 'Clear Filters',
  Code: 'Code',
  Copy: 'Copy',
  CopyMessage: 'Copy Message',
  File: 'File',
  Filter: 'Filter',
  LineColumn: '[Ln {PH1}, Col {PH2}]',
  Message: 'Message',
  NoProblemsDetected: 'No problems have been detected in the workspace.',
  NoResultsFoundWithProvidedFilterCriteria: 'No results found with provided filter criteria.',
  ProblemsDetected: 'Some problems have been detected in the workspace.',
  ShowingOfItems: 'Showing {PH1} of {PH2} ',
  Source: 'Source',
  CollapseAll: 'Collapse All',
  ViewAsTable: 'View as Table',
  ViewAsList: 'View as List',
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

export const clearFilter = () => {
  return I18NString.i18nString(UiStrings.ClearFilters)
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

export const noResultsFoundWithProvidedFilterCriteria = () => {
  return I18NString.i18nString(UiStrings.NoResultsFoundWithProvidedFilterCriteria)
}

export const collapseAll = () => {
  return I18NString.i18nString(UiStrings.CollapseAll)
}

export const viewAsList = () => {
  return I18NString.i18nString(UiStrings.ViewAsList)
}

export const viewAsTable = () => {
  return I18NString.i18nString(UiStrings.ViewAsTable)
}
