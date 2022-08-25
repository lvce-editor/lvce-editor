import * as I18nString from '../I18NString/I18NString.js'

export const UiStrings = {
  About: 'About',
  ToggleDeveloperTools: 'Toggle Developer Tools',
}

export const getMenuEntries = () => {
  return [
    {
      id: 'about',
      label: I18nString.i18nString(UiStrings.About),
      flags: /* None */ 0,
      command: 'Dialog.showAbout',
    },
    {
      id: 'toggleDeveloperTools',
      label: I18nString.i18nString(UiStrings.ToggleDeveloperTools),
      flags: /* None */ 0,
      command: 'Developer.toggleDeveloperTools',
    },
  ]
}
