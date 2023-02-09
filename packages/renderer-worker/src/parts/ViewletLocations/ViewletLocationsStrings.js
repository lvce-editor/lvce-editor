import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  NoResults: 'No Results',
  OneResultInOneFile: '1 result in 1 file',
  ManyResultsInOneFile: '{PH1} results in 1 file',
  ManyResultsInManyFiles: '{PH1} results in {PH2} files',
}

export const noResults = () => {
  return I18nString.i18nString(UiStrings.NoResults)
}

export const oneResultInOneFile = () => {
  return I18nString.i18nString(UiStrings.OneResultInOneFile)
}

export const ManyResultsInOneFile = (resultCount) => {
  return I18nString.i18nString(UiStrings.ManyResultsInOneFile, {
    PH1: resultCount,
  })
}

export const manyResultsInManyFiles = (resultCount, fileCount) => {
  return I18nString.i18nString(UiStrings.ManyResultsInManyFiles, {
    PH1: resultCount,
    PH2: fileCount,
  })
}
