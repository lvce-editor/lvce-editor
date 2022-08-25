import * as I18nString from '../I18NString/I18NString.js'

export const UiStrings = {
  SelectAll: 'Select All',
}

export const getMenuEntries = () => {
  return [
    {
      id: 'selectAll',
      label: I18nString.i18nString(UiStrings.SelectAll),
      flags: /* None */ 0,
      command: 'Editor.selectAll',
    },
  ]
}
