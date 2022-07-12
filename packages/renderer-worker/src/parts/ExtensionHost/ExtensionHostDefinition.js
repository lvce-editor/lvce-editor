import * as ExtensionHostShared from './ExtensionHostShared.js'

const combineResults = (results) => {
  return results[0]
}

export const executeDefinitionProvider = (editor, offset) => {
  return ExtensionHostShared.executeProviders({
    event: `onDefinition:${editor.languageId}`,
    method: 'ExtensionHostDefinition.executeDefinitionProvider',
    params: [editor.id, offset],
    noProviderFoundMessage: 'no definition provider found',
    combineResults,
  })
}
