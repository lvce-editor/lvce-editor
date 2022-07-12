import * as ExtensionHostShared from './ExtensionHostShared.js'

const combineResults = (results) => {
  return results[0]
}

export const executeReferenceProvider = (editor, offset) => {
  return ExtensionHostShared.executeProviders({
    event: `onReferences:${editor.languageId}`,
    method: 'ExtensionHostReferences.executeReferenceProvider',
    params: [editor.id, offset],
    noProviderFoundMessage: 'no reference providers found',
    noProviderFoundResult: [],
    combineResults,
  })
}
