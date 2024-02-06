import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'

const combineResults = (results) => {
  return results[0]
}

export const executeGrowSelection = (editor, offset) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnLanguage,
    method: ExtensionHostCommandType.DefinitionExecuteDefinitionProvider,
    args: [offset],
    noProviderFoundMessage: 'no definition provider found',
    combineResults,
  })
}
