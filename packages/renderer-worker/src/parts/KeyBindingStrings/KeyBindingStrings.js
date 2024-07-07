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
  ResultsWillUpdateAsYouType: 'Results will update as you type',
  Copy: 'Copy',
  CopyCommandId: 'Copy Command ID',
  CopyCommandTitle: 'Copy Command Title',
  ChangeKeyBinding: 'Change Keybinding...',
  AddKeyBinding: 'Add Keybinding...',
  RemoveKeyBinding: 'Remove Keybinding...',
  ResetKeyBinding: 'Reset Keybinding',
  ChangeWhenExpression: 'Change When Expression',
  ShowSameKeyBindings: 'Show Same Keybindings',
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

export const resultsWillUpdateAsYouType = () => {
  return I18nString.i18nString(UiStrings.ResultsWillUpdateAsYouType)
}

export const copy = () => {
  return I18nString.i18nString(UiStrings.Copy)
}

export const copyCommandId = () => {
  return I18nString.i18nString(UiStrings.CopyCommandId)
}

export const copyCommandTitle = () => {
  return I18nString.i18nString(UiStrings.CopyCommandTitle)
}

export const changeKeyBinding = () => {
  return I18nString.i18nString(UiStrings.ChangeKeyBinding)
}

export const addKeyBinding = () => {
  return I18nString.i18nString(UiStrings.AddKeyBinding)
}

export const removeKeyBinding = () => {
  return I18nString.i18nString(UiStrings.RemoveKeyBinding)
}

export const resetKeyBinding = () => {
  return I18nString.i18nString(UiStrings.ResetKeyBinding)
}

export const changeWhenExpression = () => {
  return I18nString.i18nString(UiStrings.ChangeWhenExpression)
}

export const showSameKeyBindings = () => {
  return I18nString.i18nString(UiStrings.ShowSameKeyBindings)
}
