import * as ExtensionHostCommands from './ExtensionHostCommands.js'
import * as ExtensionHostCore from './ExtensionHostCore.js'

export const name = 'ExtensionHost'

// prettier-ignore
export const Commands = {
  loadWebExtension: ExtensionHostCore.loadWebExtension,
  getCommands: ExtensionHostCommands.getCommands,
  executeCommand: ExtensionHostCommands.executeCommand,
  searchFileWithFetch:ExtensionHostCommands.searchFileWithFetch,
  searchFileWithHtml :ExtensionHostCommands.searchFileWithHtml,
  searchFileWithMemory :ExtensionHostCommands.searchFileWithMemory
}
