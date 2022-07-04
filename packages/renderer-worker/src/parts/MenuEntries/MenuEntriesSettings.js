export const getMenuEntries = () => {
  return [
    {
      id: 'settings',
      label: 'Settings',
      flags: /* None */ 0,
      command: 'Preferences.openSettingsJson',
    },
    {
      id: 'keyboardShortcuts',
      label: 'Keyboard Shortcuts',
      flags: /* None */ 0,
      command: /* TODO */ -1,
    },
    {
      id: 'colorTheme',
      label: 'Color Theme',
      flags: /* None */ 0,
      command: 'QuickPick.openColorTheme',
    },
    {
      id: 'checkForUpdates',
      label: 'Check For Updates',
      flags: /* None */ 0,
      command: /* TODO */ -1,
    },
  ]
}
