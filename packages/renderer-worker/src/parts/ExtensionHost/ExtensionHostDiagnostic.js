import * as ExtensionHostShared from './ExtensionHostShared.js'

const combineResults = (results) => {
  return results[0]
}

export const executeDiagnosticProvider = (editor) => {
  return ExtensionHostShared.executeProviders({
    event: `onDiagnostic:${editor.languageId}`,
    method: 'ExtensionHost.executeDiagnosticProvider',
    params: [editor.id],
    noProviderFoundMessage: 'no diagnostic provider found',
    noProviderResult: [],
    combineResults,
  })
}
