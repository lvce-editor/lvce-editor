import * as ExtensionHostCommands from './ExtensionHostCommands.js'
import * as ExtensionHostTextDocument from './ExtensionHostTextDocument.js'
import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'

export const name = 'ExtensionHost'

// prettier-ignore
export const Commands = {
  'ExtensionHostTextDocument.setLanguageId': ExtensionHostTextDocument.handleEditorLanguageChange,
  'ExtensionHostTextDocument.syncFull': ExtensionHostTextDocument.handleEditorCreate,
  'ExtensionHostTextDocument.syncIncremental': ExtensionHostTextDocument.handleEditorChange,
  executeDiagnosticProvider: () => [],
  loadWebExtension: ExtensionMeta.addWebExtension,
  getCommands: ExtensionHostCommands.getCommands,
  executeCommand: ExtensionHostCommands.executeCommand,
  searchFileWithFetch:ExtensionHostCommands.searchFileWithFetch,
  searchFileWithHtml :ExtensionHostCommands.searchFileWithHtml,
  searchFileWithMemory :ExtensionHostCommands.searchFileWithMemory
}
