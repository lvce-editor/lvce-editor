import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'

const combineResults = (results) => {
  return results[0]
}

export const executeHoverProvider = (editor, offset) => {
  return ExtensionHostEditor.execute({
    event: ExtensionHostActivationEvent.OnHover,
    editor,
    method: 'ExtensionHostHover.execute',
    args: [offset],
    noProviderFoundMessage: 'No hover provider found',
    combineResults,
  })
}
