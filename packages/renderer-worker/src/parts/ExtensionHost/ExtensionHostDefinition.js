import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'

const combineResults = (results) => {
  return results[0]
}

export const executeDefinitionProvider = (editor, offset) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnDefinition,
    method: ExtensionHostCommandType.DefinitionExecuteDefinitionProvider,
    args: [offset],
    noProviderFoundMessage: 'no definition provider found',
    combineResults,
  })
}
