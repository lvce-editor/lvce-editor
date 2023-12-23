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
