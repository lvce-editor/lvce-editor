import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'

const combineResults = (results) => {
  return results[0]
}

export const executeTabCompletionProvider = (editor, offset) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnTabCompletion,
    method: ExtensionHostCommandType.TabCompletionExecuteTabCompletionProvider,
    args: [offset],
    noProviderFoundMessage: 'No tab completion provider found',
    combineResults,
    noProviderFoundResult: undefined,
  })
}
