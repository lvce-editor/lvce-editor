import * as ExtensionHostShared from './ExtensionHostShared.js'

const combineResults = (results) => {
  return results[0]
}

export const executeCompletionProvider = async (editor, offset) => {
  return ExtensionHostShared.executeProviders({
    event: `onCompletion:${editor.languageId}`,
    method: 'ExtensionHostCompletion.execute',
    params: [editor.id, editor.offset],
    noProviderFoundMessage: 'no completion provider found',
    combineResults,
  })
}
