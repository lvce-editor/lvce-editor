import * as Rpc from '../Rpc/Rpc.ts'

export const setCursor = async (rowIndex: number, columnIndex: number) => {
  await Rpc.invoke('Editor.cursorSet', rowIndex, columnIndex)
}

export const openCompletion = async () => {
  await Rpc.invoke('Editor.openCompletion')
}

export const openEditorContextMenu = async () => {
  await Rpc.invoke('Editor.handleContextMenu', 0, 0)
}

export const invokeTabCompletion = async () => {
  await Rpc.invoke('Editor.tabCompletion')
}

export const executeTabCompletion = async () => {
  await Rpc.invoke('Editor.tabCompletion')
}

export const invokeBraceCompletion = async (text: string) => {
  await Rpc.invoke('Editor.braceCompletion', text)
}

export const cursorCharacterRight = async () => {
  await Rpc.invoke('Editor.cursorCharacterRight')
}

export const cursorCharacterLeft = async () => {
  await Rpc.invoke('Editor.cursorCharacterLeft')
}

export const copyLineDown = async () => {
  await Rpc.invoke('Editor.copyLineDown')
}

export const cursorDown = async () => {
  await Rpc.invoke('Editor.cursorDown')
}

export const cursorUp = async () => {
  await Rpc.invoke('Editor.cursorUp')
}

export const cursorWordLeft = async () => {
  await Rpc.invoke('Editor.cursorWordLeft')
}

export const cursorWordRight = async () => {
  await Rpc.invoke('Editor.cursorWordRight')
}

export const goToDefinition = async () => {
  await Rpc.invoke('Editor.goToDefinition')
}

export const openHover = async () => {
  await Rpc.invoke('Editor.showHover')
}

export const goToTypeDefinition = async () => {
  await Rpc.invoke('Editor.goToTypeDefinition')
}

export const type = async (text: string) => {
  await Rpc.invoke('Editor.type')
}

export const findAllReferences = async () => {
  await Rpc.invoke('SideBar.show', 'References', /* focus */ true)
}

export const findAllImplementations = async () => {
  await Rpc.invoke('SideBar.show', 'Implementations', /* focus */ true)
}

export const setSelections = async (selections: any) => {
  await Rpc.invoke('Editor.setSelections', selections)
}

export const openFindWidget = async () => {
  await Rpc.invoke('Editor.openFind')
}

export const setDeltaY = async (deltaY: number) => {
  await Rpc.invoke('Editor.setDeltaY', deltaY)
}

export const format = async () => {
  await Rpc.invoke('Editor.format')
}

export const insertLineBreak = async () => {
  await Rpc.invoke('Editor.insertLineBreak')
}

export const openSourceActions = async () => {
  await Rpc.invoke('Editor.showSourceActions')
}

export const sourceActionsSelectCurrent = async () => {
  await Rpc.invoke('EditorSourceActions.selectCurrent')
}
