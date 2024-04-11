import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  KeyBindings: 'KeyBindings',
  Command: 'Command',
  When: 'When',
  Key: 'Key',
  EmptyString: '',
  TypeToSearchKeyBindings: 'Type to search in keybindings',
  PressDesiredKeyCombinationThenPressEnter: 'Press Desired Key Combination, Then Press Enter',
  SearchKeyBindings: 'Search Key Bindings', // TODO placeholder string should come from renderer worker
  ResultsWillUpdateAsYouType: 'Results will update as you type',
}

export const keyBindings = () => {
  return I18nString.i18nString(UiStrings.KeyBindings)
}

export const command = () => {
  return I18nString.i18nString(UiStrings.Command)
}

export const when = () => {
  return I18nString.i18nString(UiStrings.When)
}

export const key = () => {
  return I18nString.i18nString(UiStrings.Key)
}

export const typeToSearchKeyBindings = () => {
  return I18nString.i18nString(UiStrings.TypeToSearchKeyBindings)
}

export const pressDesiredKeyCombinationThenPressEnter = () => {
  return I18nString.i18nString(UiStrings.PressDesiredKeyCombinationThenPressEnter)
}

export const searchKeyBindings = () => {
  return I18nString.i18nString(UiStrings.SearchKeyBindings)
}

export const resultsWillUpdateAsYouType = () => {
  return I18nString.i18nString(UiStrings.ResultsWillUpdateAsYouType)
}
