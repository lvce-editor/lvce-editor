import * as ExtensionHostShared from './ExtensionHostShared.js'

const combineResults = (results) => {
  return results[0]
}

export const executeSemanticTokenProvider = async (editor) => {
  return ExtensionHostShared.executeProviders({
    event: `onSemanticTokens:${editor.languageId}`,
    method: 'ExtensionHostSemanticTokens.executeSemanticTokenProvider',
    params: [editor.id],
    noProviderFoundMessage: 'No Semantic Token Provider found',
    combineResults,
  })
}
