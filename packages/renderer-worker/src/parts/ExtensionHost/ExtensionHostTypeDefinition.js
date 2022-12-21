import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'

const combineResults = (results) => {
  return results[0]
}

export const executeTypeDefinitionProvider = (editor, offset) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnTypeDefinition,
    method: ExtensionHostCommandType.TypeDefinitionExecuteTypeDefinitionProvider,
    args: [offset],
    noProviderFoundMessage: 'No type definition provider found',
    noProviderFoundResult: undefined,
    combineResults,
  })
}
