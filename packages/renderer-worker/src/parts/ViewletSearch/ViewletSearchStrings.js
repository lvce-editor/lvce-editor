import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  NoResults: 'No results found',
  Oneresult: 'Found 1 result in 1 file',
  ManyResultsInOneFile: `Found {PH1} results in 1 file`,
  ManyResultsInManyFiles: `Found {PH1} results in {PH2} files`,
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
