import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'

export const executeFormattingProvider = (editor) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnFormatting,
    method: 'ExtensionHostFormatting.executeFormattingProvider',
    args: [],
    noProviderFoundMessage: 'No formatting provider found',
    combineResults() {
      return []
    },
  })
}
