import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'

const combineResults = (results) => {
  return results[0]
}

export const executeDefinitionProvider = (editor, offset) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnDefinition,
    method: 'ExtensionHostDefinition.executeDefinitionProvider',
    args: [offset],
    noProviderFoundMessage: 'no definition provider found',
    combineResults,
  })
}
