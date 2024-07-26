import * as Assert from '../Assert/Assert.ts'
import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  NoResults: 'No results found',
  Oneresult: '1 result in 1 file',
  ManyResultsInOneFile: '{PH1} results in 1 file',
  ManyResultsInManyFiles: '{PH1} results in {PH2} files',
  ReplaceAll: 'Replace All',
  Replace: 'Replace',
  ConfirmReplaceAll: 'Replace All?',
  ConfirmReplaceOneOccurrenceInOneFile: "Replace 1 occurrence across 1 file with '{PH1}'",
  ConfirmReplaceOneOccurrenceInOneFileNoValue: 'Replace 1 occurrence across 1 file',
  ConfirmReplaceManyOccurrencesInOneFile: "Replace {PH1} occurrences across 1 file with '{PH2}'",
  ConfirmReplaceManyOccurrencesInOneFileNoValue: 'Replace {PH1} occurrences across 1 file',
  ConfirmReplaceManyOccurrencesInManyFiles: "Replace {PH1} occurrences across {PH2} files with '{PH3}'",
  ConfirmReplaceManyOccurrencesInManyFilesNoValue: 'Replace {PH1} occurrences across {PH2} files',
  ReplacedOneOccurrenceInOneFile: "Replaced 1 occurrence across 1 file with '{PH1}'",
  ReplacedManyOccurrencesInOneFile: "Replaced {PH1} occurrences across 1 file with '{PH2}'",
  ReplacedManyOccurrencesInManyFiles: "Replaced {PH1} occurrences across {PH2} files with '{PH3}'",
  CopyPath: 'Copy Path',
  Dismiss: 'Dismiss',
  Refresh: 'Refresh',
  ClearSearchResults: 'Clear Search Results',
  OpenNewSearchEditor: 'Open New Search Editor',
  ViewAsTree: 'View as Tree',
  CollapseAll: 'Collapse All',
}

export const noResults = () => {
  return I18nString.i18nString(UiStrings.NoResults)
}

export const oneResult = () => {
  return I18nString.i18nString(UiStrings.Oneresult)
}

export const manyResultsInOneFile = (resultCount) => {
  return I18nString.i18nString(UiStrings.ManyResultsInOneFile, {
    PH1: resultCount,
  })
}

export const manyResultsInManyFiles = (resultCount, fileResultCount) => {
  return I18nString.i18nString(UiStrings.ManyResultsInManyFiles, {
    PH1: resultCount,
    PH2: fileResultCount,
  })
}

export const confirmReplaceOneOccurrenceInOneFile = (replacement) => {
  return I18nString.i18nString(UiStrings.ConfirmReplaceOneOccurrenceInOneFile, {
    PH1: replacement,
  })
}

export const confirmReplaceOneOccurrenceInOneFileNoValue = () => {
  return I18nString.i18nString(UiStrings.ConfirmReplaceOneOccurrenceInOneFileNoValue)
}

export const confirmReplaceManyOccurrencesInOneFile = (matchCount, replacement) => {
  return I18nString.i18nString(UiStrings.ConfirmReplaceManyOccurrencesInOneFile, {
    PH1: matchCount,
    PH2: replacement,
  })
}

export const confirmReplaceManyOccurrencesInOneFileNoValue = (matchCount) => {
  return I18nString.i18nString(UiStrings.ConfirmReplaceManyOccurrencesInOneFileNoValue, {
    PH1: matchCount,
  })
}

export const confirmReplaceManyOccurrencesInManyFiles = (matchCount, fileCount, replacement) => {
  Assert.number(matchCount)
  Assert.number(fileCount)
  Assert.string(replacement)
  return I18nString.i18nString(UiStrings.ConfirmReplaceManyOccurrencesInManyFiles, {
    PH1: matchCount,
    PH2: fileCount,
    PH3: replacement,
  })
}

export const confirmReplaceManyOccurrencesInManyFilesNoValue = (matchCount, fileCount) => {
  Assert.number(matchCount)
  Assert.number(fileCount)
  return I18nString.i18nString(UiStrings.ConfirmReplaceManyOccurrencesInManyFilesNoValue, {
    PH1: matchCount,
    PH2: fileCount,
  })
}

export const replacedOneOccurrenceInOneFile = (replacement) => {
  return I18nString.i18nString(UiStrings.ReplacedOneOccurrenceInOneFile, {
    PH1: replacement,
  })
}

export const replacedManyOccurrencesInOneFile = (matchCount, replacement) => {
  return I18nString.i18nString(UiStrings.ReplacedOneOccurrenceInOneFile, {
    PH1: matchCount,
    PH2: replacement,
  })
}

export const replacedManyOccurrencesInManyFiles = (matchCount, fileCount, replacement) => {
  return I18nString.i18nString(UiStrings.ReplacedManyOccurrencesInManyFiles, {
    PH1: matchCount,
    PH2: fileCount,
    PH3: replacement,
  })
}

export const replaceAll = () => {
  return I18nString.i18nString(UiStrings.ReplaceAll)
}

export const replace = () => {
  return I18nString.i18nString(UiStrings.Replace)
}

export const dismiss = () => {
  return I18nString.i18nString(UiStrings.Dismiss)
}

export const copyPath = () => {
  return I18nString.i18nString(UiStrings.CopyPath)
}

export const refresh = () => {
  return I18nString.i18nString(UiStrings.Refresh)
}

export const clearSearchResults = () => {
  return I18nString.i18nString(UiStrings.ClearSearchResults)
}

export const openNewSearchEditor = () => {
  return I18nString.i18nString(UiStrings.OpenNewSearchEditor)
}

export const viewAsTree = () => {
  return I18nString.i18nString(UiStrings.ViewAsTree)
}

export const collapseAll = () => {
  return I18nString.i18nString(UiStrings.CollapseAll)
}
