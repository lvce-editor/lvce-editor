import * as Command from '../Command/Command.js'

export const setCursor = async (rowIndex, columnIndex) => {
  await Command.execute('Editor.cursorSet', { rowIndex, columnIndex })
}

export const openCompletion = async () => {
  await Command.execute('Editor.openCompletion')
}

export const openEditorContextMenu = async () => {
  await Command.execute('Editor.handleContextMenu', 0, 0)
}

export const executeTabCompletion = async () => {
  await Command.execute('Editor.tabCompletion')
}

export const executeBraceCompletion = async (text) => {
  await Command.execute('Editor.braceCompletion', text)
}
