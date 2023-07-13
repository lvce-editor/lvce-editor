import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'

const combineResults = (results) => {
  return results[0] ?? []
}

export const executeCompletionProvider = (editor, offset) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnCompletion,
    method: ExtensionHostCommandType.CompletionExecute,
    args: [offset],
    noProviderFoundMessage: 'no completion provider found',
    noProviderFoundResult: [],
    combineResults,
  })
}

const combineResultsResolve = (items) => {
  return items[0] ?? undefined
}

export const executeResolveCompletionItem = (editor, offset, completionItem) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnCompletion,
    method: ExtensionHostCommandType.CompletionResolveExecute,
    args: [offset, completionItem],
    noProviderFoundMessage: 'no completion provider found',
    noProviderFoundResult: [],
    combineResults: combineResultsResolve,
  })
}
