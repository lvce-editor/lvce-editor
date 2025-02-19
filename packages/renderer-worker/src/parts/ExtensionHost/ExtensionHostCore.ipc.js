import * as ExtensionHostCore from './ExtensionHostCore.js'
import * as ExtensionHostCommands from './ExtensionHostCommands.js'

export const name = 'ExtensionHost'

// prettier-ignore
export const Commands = {
  loadWebExtension: ExtensionHostCore.loadWebExtension,
  getCommands: ExtensionHostCommands.getCommands,
}
