import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  MatchesFoundFor: `{PH1} of {PH2} found for {PH3}`,
  MatchOf: `{PH1} of {PH2}`,
  NoResults: 'No Results',
  Close: 'Close',
  PreviousMatch: 'Previous Match',
  NextMatch: 'Next Match',
  Find: 'Find',
}

export const noResults = () => {
  return I18nString.i18nString(UiStrings.NoResults)
}

export const matchOf = (matchIndex, matchCount) => {
  return I18nString.i18nString(UiStrings.MatchOf, {
    PH1: matchIndex,
    PH2: matchCount,
  })
}

export const matchesFoundFor = (matchIndex, matchCount, value) => {
  return I18nString.i18nString(UiStrings.MatchesFoundFor, {
    PH1: matchIndex,
    PH2: matchCount,
    PH3: value,
  })
}

export const previousMatch = () => {
  return I18nString.i18nString(UiStrings.PreviousMatch)
}

export const nextMatch = () => {
  return I18nString.i18nString(UiStrings.NextMatch)
}

export const close = () => {
  return I18nString.i18nString(UiStrings.Close)
}
