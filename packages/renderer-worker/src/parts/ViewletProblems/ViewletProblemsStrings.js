import * as I18NString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  NoProblemsDetected: 'No problems have been detected in the workspace.',
  ProblemsDetected: 'Some problems have been detected in the workspace.',
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
