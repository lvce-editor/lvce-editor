import * as ExtensionHostManagement from './ExtensionHostManagement.js'
import * as ExtensionHostShared from './ExtensionHostShared.js'

const combineResults = (results) => {
  return results[0]
}

export const executeHoverProvider = async (editor, offset) => {
  return ExtensionHostShared.executeProviders({
    event: `onHover:${editor.languageId}`,
    method: 'ExtensionHostHover.execute',
    params: [editor.id, offset],
    noProviderFoundMessage: 'No hover provider found',
    combineResults,
  })
}
