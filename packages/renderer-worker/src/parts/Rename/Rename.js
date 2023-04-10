import * as ExtensionHostRename from '../ExtensionHost/ExtensionHostRename.js'

export const prepareRename = (editor, offset) => {
  return ExtensionHostRename.executePrepareRenameProvider(editor, offset)
}

export const rename = (editor, offset, newName) => {
  return ExtensionHostRename.executeRenameProvider(editor, offset)
}
