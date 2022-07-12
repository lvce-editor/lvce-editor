import * as ExtensionHostShared from './ExtensionHostShared.js'

const combineResults = (results) => {
  return results[0]
}

export const executeBraceCompletionProvider = (
  editor,
  offset,
  openingBrace
) => {
  return ExtensionHostShared.executeProviders({
    event: `onBraceCompletion:${editor.languageId}`,
    method: 'ExtensionHostBraceCompletion.executeBraceCompletionProvider',
    params: [offset, openingBrace],
    noProviderFoundMessage: 'no brace completion providers found',
    combineResults,
  })
}
