import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'

const combineResults = (results) => {
  return results[0]
}

export const executeImplementationProvider = (editor, offset) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnImplementation,
    method: 'ExtensionHostImplementation.executeImplementationProvider',
    args: [offset],
    noProviderFoundMessage: 'No implementation provider found',
    combineResults,
  })
}
