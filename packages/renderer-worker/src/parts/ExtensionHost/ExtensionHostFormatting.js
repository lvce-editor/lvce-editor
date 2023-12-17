import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'

export const executeFormattingProvider = (editor) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnFormatting,
    method: ExtensionHostCommandType.FormattingExecuteFormmattingProvider,
    args: [],
    noProviderFoundMessage: 'No formatting provider found',
    combineResults(results) {
      return results[0]
    },
  })
}
