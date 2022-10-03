import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'

const combineResults = (results) => {
  return results[0]
}

export const executeSemanticTokenProvider = (editor) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnSemanticTokens,
    method: 'ExtensionHostSemanticTokens.executeSemanticTokenProvider',
    args: [],
    noProviderFoundMessage: 'No Semantic Token Provider found',
    combineResults,
    noProviderFoundResult: [],
  })
}
