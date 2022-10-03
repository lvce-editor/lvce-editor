import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'

const combineResults = (results) => {
  return results[0]
}

export const executeTypeDefinitionProvider = (editor, offset) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnTypeDefinition,
    method: 'ExtensionHostTypeDefinition.executeTypeDefinitionProvider',
    args: [offset],
    noProviderFoundMessage: 'No type definition provider found',
    combineResults,
  })
}
