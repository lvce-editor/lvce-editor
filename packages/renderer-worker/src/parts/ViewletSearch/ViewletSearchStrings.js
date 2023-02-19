import * as Assert from '../Assert/Assert.js'
import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  NoResults: 'No results found',
  Oneresult: 'Found 1 result in 1 file',
  ManyResultsInOneFile: `Found {PH1} results in 1 file`,
  ManyResultsInManyFiles: `Found {PH1} results in {PH2} files`,
  ReplaceAll: 'Replace All',
  ConfirmReplaceAll: 'Replace All?',
  ConfirmReplaceOneOccurrenceInOneFile: "Replace 1 occurrence across 1 file with '{PH1}'",
  ConfirmReplaceManyOccurrencesInOneFile: "Replace {PH1} occurrences across 1 file with '{PH2}'",
  ConfirmReplaceManyOccurrencesInManyFiles: "Replace {PH1} occurrences across {PH2} files with '{PH3}'",
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

export const confirmReplaceManyOccurrencesInOneFile = (matchCount, replacement) => {
  return I18nString.i18nString(UiStrings.ConfirmReplaceManyOccurrencesInOneFile, {
    PH1: matchCount,
    PH2: replacement,
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
