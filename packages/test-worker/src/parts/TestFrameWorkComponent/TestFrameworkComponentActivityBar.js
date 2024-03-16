import * as Command from '../Command/Command.js'

export const focus = async () => {
  await Command.execute('ActivityBar.focus')
}

export const focusFirst = async () => {
  await Command.execute('ActivityBar.focusFirst')
}

export const focusLast = async () => {
  await Command.execute('ActivityBar.focusLast')
}

export const focusNext = async () => {
  await Command.execute('ActivityBar.focusNext')
}

export const focusPrevious = async () => {
  await Command.execute('ActivityBar.focusPrevious')
}

export const handleClick = async (index) => {
  await Command.execute('ActivityBar.handleClick', index)
}

export const handleContextMenu = async () => {
  await Command.execute('ActivityBar.handleContextMenu')
}

export const selectCurrent = async () => {
  await Command.execute('ActivityBar.selectCurrent')
}
