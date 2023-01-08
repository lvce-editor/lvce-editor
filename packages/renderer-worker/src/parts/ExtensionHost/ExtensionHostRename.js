import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'

const combineResultsPrepareRename = (results) => {
  return results[0]
}

export const executePrepareRenameProvider = (editor, offset) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnRename,
    method: ExtensionHostCommandType.RenamePrepareRename,
    args: [offset],
    noProviderFoundMessage: 'No rename provider found',
    combineResults: combineResultsPrepareRename,
  })
}

const combineResultsRename = (results) => {
  return results[0]
}

export const executeRenameProvider = (editor, offset, newName) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnRename,
    method: ExtensionHostCommandType.RenameExecuteRename,
    args: [offset, newName],
    noProviderFoundMessage: 'No rename provider found',
    combineResults: combineResultsPrepareRename,
  })
}
