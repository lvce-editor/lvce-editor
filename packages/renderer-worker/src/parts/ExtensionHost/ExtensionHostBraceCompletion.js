import * as ExtensionHostShared from './ExtensionHostShared.js'
import * as Assert from '../Assert/Assert.js'

const combineResults = (results) => {
  return results[0]
}

export const executeBraceCompletionProvider = (
  editor,
  offset,
  openingBrace
) => {
  Assert.object(editor)
  Assert.number(offset)
  Assert.string(openingBrace)
  return ExtensionHostShared.executeProviders({
    event: `onBraceCompletion:${editor.languageId}`,
    method: 'ExtensionHostBraceCompletion.executeBraceCompletionProvider',
    params: [editor.id, offset, openingBrace],
    noProviderFoundMessage: 'no brace completion providers found',
    noProviderFoundResult: undefined,
    combineResults,
  })
}
