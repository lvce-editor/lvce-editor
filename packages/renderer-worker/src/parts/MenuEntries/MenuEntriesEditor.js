import * as I18nString from '../I18NString/I18NString.js'

export const UiStrings = {
  GoToTypeDefinition: 'Go To Type Definition',
  FindAllReferences: 'Find All References',
  FindAllImplementations: 'Find All Implementations',
  Cut: 'Cut',
  Copy: 'Copy',
  Paste: 'Paste',
}

export const getMenuEntries = () => {
  return [
    {
      id: 'go-to-type-definition',
      label: I18nString.i18nString(UiStrings.GoToTypeDefinition),
      flags: /* None */ 0,
      command: /* Editor.goToTypeDefinition */ 'Editor.goToTypeDefinition',
    },
    {
      id: 'find-all-references',
      label: I18nString.i18nString(UiStrings.FindAllReferences),
      flags: /* None */ 0,
      command: /* ViewletSideBar.show */ 'SideBar.show',
      args: [/* id */ 'References', /* focus */ true],
    },
    {
      id: 'find-all-implementations',
      label: I18nString.i18nString(UiStrings.FindAllImplementations),
      flags: /* None */ 0,
      command: /* ViewletSideBar.show */ 'SideBar.show',
      args: [/* id */ 'Implementations', /* focus */ true],
    },
    {
      id: 'cut',
      label: I18nString.i18nString(UiStrings.Cut),
      flags: /* None */ 0,
      command: /* Editor.cut */ 'Editor.cut',
    },
    {
      id: 'copy',
      label: I18nString.i18nString(UiStrings.Copy),
      flags: /* None */ 0,
      command: /* Editor.copy */ 'Editor.copy',
    },
    {
      id: 'paste',
      label: I18nString.i18nString(UiStrings.Paste),
      flags: /* None */ 0,
      command: /* Editor.paste */ 'Editor.paste',
    },
  ]
}
