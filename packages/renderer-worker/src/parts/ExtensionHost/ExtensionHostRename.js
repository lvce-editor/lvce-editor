import * as ExtensionHostShared from './ExtensionHostShared.js'

const combineResultsPrepareRename = (results) => {
  return results[0]
}

export const executePrepareRenameProvider = (editor, offset) => {
  return ExtensionHostShared.executeProviders({
    event: `onRename:${editor.languageId}`,
    method: 'ExtensionHostRename.executePrepareRename',
    params: [editor.id, offset],
    noProviderFoundMessage: 'No rename provider found',
    combineResults: combineResultsPrepareRename,
  })
}

const combineResultsRename = (results) => {
  return results[0]
}

export const executeRenameProvider = (editor, offset, newName) => {
  return ExtensionHostShared.executeProviders({
    event: `onRename:${editor.languageId}`,
    method: 'ExtensionHostRename.executeRename',
    params: [editor.id, offset, newName],
    noProviderFoundMessage: 'No rename provider found',
    combineResults: combineResultsPrepareRename,
  })
}
