import * as ExtensionManagement from './ExtensionManagement.js'

export const name = 'ExtensionManagement'

export const Commands = {
  disable: ExtensionManagement.disable,
  enable: ExtensionManagement.enable,
  getAllExtensions: ExtensionManagement.getAllExtensions,
  getExtension: ExtensionManagement.getExtension2,
  getExtensions: ExtensionManagement.getAllExtensions,
  getExtensionsEtag: ExtensionManagement.getExtensionsEtag,
  handleExtensionStatusUpdate: ExtensionManagement.handleExtensionStatusUpdate,
  handleViewContextChange: ExtensionManagement.handleViewContextChange,
  showViewContextMenu: ExtensionManagement.showViewContextMenu,
  uninstall: ExtensionManagement.uninstall,
  invalidateExtensionsCache: ExtensionManagement.invalidateExtensionsCache,
}
