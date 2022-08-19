import * as Command from '../Command/Command.js'

export const setCursor = async (rowIndex, columnIndex) => {
  await Command.execute('Editor.cursorSet', rowIndex, columnIndex)
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

export const cursorCharacterRight = async () => {
  await Command.execute('Editor.cursorCharacterRight')
}

export const cursorCharacterLeft = async () => {
  await Command.execute('Editor.cursorCharacterLeft')
}

export const copyLineDown = async () => {
  await Command.execute('Editor.copyLineDown')
}

export const cursorDown = async () => {
  await Command.execute('Editor.cursorDown')
}

export const cursorUp = async () => {
  await Command.execute('Editor.cursorUp')
}

export const cursorWordLeft = async () => {
  await Command.execute('Editor.cursorWordLeft')
}

export const cursorWordRight = async () => {
  await Command.execute('Editor.cursorWordRight')
}

export const goToDefinition = async () => {
  await Command.execute('Editor.goToDefinition')
}

export const goToTypeDefinition = async () => {
  await Command.execute('Editor.goToTypeDefinition')
}

export const type = async (text) => {
  await Command.execute('Editor.type')
}
