import * as Command from '../Command/Command.js'

export const openContextMenu = async (index) => {
  await Command.execute('Explorer.handleContextMenuKeyboard', index)
}

export const focus = async () => {
  await Command.execute('Explorer.focusIndex', -1)
}

export const focusNext = async () => {
  await Command.execute('Explorer.focusNext')
}

export const clickCurrent = async () => {
  await Command.execute('Explorer.handleClickCurrent')
}

export const handleArrowLeft = async () => {
  await Command.execute('Explorer.handleArrowLeft')
}

export const focusLast = async () => {
  await Command.execute('Explorer.focusLast')
}

export const focusFirst = async () => {
  await Command.execute('Explorer.focusFirst')
}

export const removeDirent = async () => {
  await Command.execute('Explorer.removeDirent')
}

export const expandRecursively = async () => {
  await Command.execute('Explorer.expandRecursively')
}
