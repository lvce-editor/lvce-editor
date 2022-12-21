import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'

const combineResults = (results) => {
  return results[0]
}

export const executeImplementationProvider = (editor, offset) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnImplementation,
    method: ExtensionHostCommandType.ImplementationExecuteImplementationProvider,
    args: [offset],
    noProviderFoundMessage: 'No implementation provider found',
    combineResults,
  })
}
