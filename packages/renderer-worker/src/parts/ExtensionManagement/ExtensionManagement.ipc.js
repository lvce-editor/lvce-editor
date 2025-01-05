import * as ExtensionManagement from './ExtensionManagement.js'

export const name = 'ExtensionManagement'

export const Commands = {
  getAllExtensions: ExtensionManagement.getAllExtensions,
  getExtensions: ExtensionManagement.getAllExtensions,
  getExtensionsEtag: ExtensionManagement.getExtensionsEtag,
}
