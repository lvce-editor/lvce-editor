import * as ExtensionHostShared from './ExtensionHostShared.js'

const combineResults = (results) => {
  return results[0]
}

export const executeClosingTagProvider = async (
  textDocument,
  offset,
  openingBrace
) => {
  return ExtensionHostShared.executeProviders({
    event: `onClosingTag:${textDocument.languageId}`,
    method: 'ExtensionHostClosingTag.executeClosingTagProvider',
    params: [textDocument.id, offset, openingBrace],
    combineResults,
  })
}
