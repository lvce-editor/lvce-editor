export const getMenuEntries = () => {
  return [
    {
      id: 'about',
      label: 'About',
      flags: /* None */ 0,
      command: 'Dialog.showAbout',
    },
    {
      id: 'toggleDeveloperTools',
      label: 'Toggle Developer Tools',
      flags: /* None */ 0,
      command: 'Developer.toggleDeveloperTools',
    },
  ]
}
