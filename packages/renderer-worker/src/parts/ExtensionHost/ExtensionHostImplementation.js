import * as ExtensionHostShared from './ExtensionHostShared.js'

const combineResults = (results) => {
  return results[0]
}

export const executeImplementationProvider = async (editor, offset) => {
  return ExtensionHostShared.executeProviders({
    event: `onImplementation:${editor.languageId}`,
    method: 'ExtensionHostImplementation.executeImplementationProvider',
    params: [editor.id, offset],
    noProviderFoundMessage: 'No implementation provider found',
    combineResults,
  })
}
