import * as ExtensionHostShared from './ExtensionHostShared.js'

const combineResults = (results) => {
  return results[0]
}

export const executeTabCompletionProvider = async (editor, offset) => {
  return ExtensionHostShared.executeProviders({
    event: `onTabCompletion:${editor.languageId}`,
    method: 'ExtensionHost.executeTabCompletionProvider',
    params: [editor.id, offset],
    noProviderFoundMessage: 'No tab completion provider found',
    combineResults,
  })
}
