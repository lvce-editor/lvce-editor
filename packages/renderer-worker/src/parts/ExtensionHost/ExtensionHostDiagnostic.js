import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'

const combineResults = (results) => {
  return results[0]
}

export const executeDiagnosticProvider = (editor) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnDiagnostic,
    method: 'ExtensionHost.executeDiagnosticProvider',
    args: [],
    noProviderFoundMessage: 'no diagnostic provider found',
    noProviderResult: [],
    combineResults,
  })
}
