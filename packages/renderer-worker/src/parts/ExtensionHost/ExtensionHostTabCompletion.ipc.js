import * as ExtensionHostTabCompletion from './ExtensionHostTabCompletion.js'

export const name = 'ExtensionHostTabCompletion'

export const Commands = {
  executeTabCompletionProvider: ExtensionHostTabCompletion.executeTabCompletionProvider,
}
