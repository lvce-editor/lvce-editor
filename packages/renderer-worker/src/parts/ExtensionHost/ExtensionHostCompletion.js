import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'

const combineResults = (results) => {
  return results[0] ?? []
}

export const executeCompletionProvider = (editor, offset) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnCompletion,
    method: 'ExtensionHostCompletion.execute',
    args: [offset],
    noProviderFoundMessage: 'no completion provider found',
    noProviderFoundResult: [],
    combineResults,
  })
}
