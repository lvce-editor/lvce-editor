import * as ExtensionHostCore from './ExtensionHostCore.js'

export const name = 'ExtensionHost'

// prettier-ignore
export const Commands = {
  loadWebExtension: ExtensionHostCore.loadWebExtension,
  startWebExtensionHost: ExtensionHostCore.startWebExtensionHost,
}
