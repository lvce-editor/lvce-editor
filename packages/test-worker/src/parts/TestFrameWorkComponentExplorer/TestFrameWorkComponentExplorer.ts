import * as Rpc from '../Rpc/Rpc.ts'

export const openContextMenu = async (index: number) => {
  await Rpc.invoke('Explorer.handleContextMenuKeyboard', index)
}

export const focus = async () => {
  await Rpc.invoke('Explorer.focusIndex', -1)
}

export const focusNext = async () => {
  await Rpc.invoke('Explorer.focusNext')
}

export const focusIndex = async (index: number) => {
  await Rpc.invoke('Explorer.focusIndex', index)
}

export const clickCurrent = async () => {
  await Rpc.invoke('Explorer.handleClickCurrent')
}

export const handleArrowLeft = async () => {
  await Rpc.invoke('Explorer.handleArrowLeft')
}

export const focusLast = async () => {
  await Rpc.invoke('Explorer.focusLast')
}

export const focusFirst = async () => {
  await Rpc.invoke('Explorer.focusFirst')
}

export const removeDirent = async () => {
  await Rpc.invoke('Explorer.removeDirent')
}

export const expandRecursively = async () => {
  await Rpc.invoke('Explorer.expandRecursively')
}

export const newFile = async () => {
  await Rpc.invoke('Explorer.newFile')
}

export const handleClick = async (index: number) => {
  await Rpc.invoke('Explorer.handleClick', index)
}

export const rename = async () => {
  await Rpc.invoke('Explorer.rename')
}

export const cancelEdit = async () => {
  await Rpc.invoke('Explorer.cancelEdit')
}

export const acceptEdit = async () => {
  await Rpc.invoke('Explorer.acceptEdit')
}

export const updateEditingValue = async (value: string) => {
  await Rpc.invoke('Explorer.updateEditingValue', value)
}

export const expandAll = async (value: string) => {
  await Rpc.invoke('Explorer.expandAll', value)
}
