import * as Command from '../Command/Command.js'

export const closeMenu = async () => {
  await Command.execute('TitleBarMenuBar.closeMenu')
}

export const focus = async () => {
  await Command.execute('TitleBarMenuBar.focus')
}

export const focusFirst = async () => {
  await Command.execute('TitleBarMenuBar.focusFirst')
}

export const focusIndex = async (index) => {
  await Command.execute('TitleBarMenuBar.focusIndex', index)
}

export const focusLast = async () => {
  await Command.execute('TitleBarMenuBar.focusLast')
}

export const focusNext = async () => {
  await Command.execute('TitleBarMenuBar.focusNext')
}

export const focusPrevious = async () => {
  await Command.execute('TitleBarMenuBar.focusPrevious')
}

export const handleKeyArrowDown = async () => {
  await Command.execute('TitleBarMenuBar.handleKeyArrowDown')
}

export const handleKeyArrowLeft = async () => {
  await Command.execute('TitleBarMenuBar.handleKeyArrowLeft')
}

export const handleKeyArrowRight = async () => {
  await Command.execute('TitleBarMenuBar.handleKeyArrowRight')
}

export const handleKeyArrowUp = async () => {
  await Command.execute('TitleBarMenuBar.handleKeyArrowUp')
}

export const handleKeyEnd = async () => {
  await Command.execute('TitleBarMenuBar.handleKeyEnd')
}

export const handleKeyHome = async () => {
  await Command.execute('TitleBarMenuBar.handleKeyHome')
}
export const handleKeySpace = async () => {
  await Command.execute('TitleBarMenuBar.handleKeySpace')
}

export const toggleIndex = async (index) => {
  await Command.execute('TitleBarMenuBar.toggleIndex', index)
}

export const toggleMenu = async () => {
  await Command.execute('TitleBarMenuBar.toggleMenu')
}
