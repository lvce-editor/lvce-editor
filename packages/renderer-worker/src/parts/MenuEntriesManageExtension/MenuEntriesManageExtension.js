import * as ExtensionSearchViewWorker from '../ExtensionSearchViewWorker/ExtensionSearchViewWorker.js'

export const getMenuEntries = async () => {
  const entries = await ExtensionSearchViewWorker.invoke('SearchExtensions.getMenuEntries')
  return entries
  // {
  //   id: 'enable',
  //   label: ViewletExtensionsStrings.enable(),
  //   flags: MenuItemFlags.None,
  //   command: -1,
  // },
  // {
  //   id: 'disable',
  //   label: ViewletExtensionsStrings.disable(),
  //   flags: MenuItemFlags.None,
  //   command: -1,
  // },
  // {
  //   id: 'uninstall',
  //   label: ViewletExtensionsStrings.uninstall(),
  //   flags: MenuItemFlags.None,
  //   command: 'Extensions.uninstall',
  // },
  // {
  //   id: 'installAnotherVersion',
  //   label: ViewletExtensionsStrings.installAnotherVersion(),
  //   flags: MenuItemFlags.None,
  //   command: -1,
  // },
}
