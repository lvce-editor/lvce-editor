import * as ExtensionHostShared from './ExtensionHostShared.js'

const combineResults = (results) => {
  return results[0]
}

export const executeTypeDefinitionProvider = async (editor, offset) => {
  return ExtensionHostShared.executeProviders({
    event: `onTypeDefinition:${editor.languageId}`,
    method: 'ExtensionHostClosingTag.executeTypeDefinitionProvider',
    params: [editor.id, offset],
    noProviderFoundMessage: `No type definition provider found`,
    combineResults,
  })
}
