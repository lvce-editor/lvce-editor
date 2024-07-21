import * as Rpc from '../Rpc/Rpc.ts'

export const closeMenu = async () => {
  await Rpc.invoke('TitleBarMenuBar.closeMenu')
}

export const focus = async () => {
  await Rpc.invoke('TitleBarMenuBar.focus')
}

export const focusFirst = async () => {
  await Rpc.invoke('TitleBarMenuBar.focusFirst')
}

export const focusIndex = async (index: number) => {
  await Rpc.invoke('TitleBarMenuBar.focusIndex', index)
}

export const focusLast = async () => {
  await Rpc.invoke('TitleBarMenuBar.focusLast')
}

export const focusNext = async () => {
  await Rpc.invoke('TitleBarMenuBar.focusNext')
}

export const focusPrevious = async () => {
  await Rpc.invoke('TitleBarMenuBar.focusPrevious')
}

export const handleKeyArrowDown = async () => {
  await Rpc.invoke('TitleBarMenuBar.handleKeyArrowDown')
}

export const handleKeyArrowLeft = async () => {
  await Rpc.invoke('TitleBarMenuBar.handleKeyArrowLeft')
}

export const handleKeyArrowRight = async () => {
  await Rpc.invoke('TitleBarMenuBar.handleKeyArrowRight')
}

export const handleKeyArrowUp = async () => {
  await Rpc.invoke('TitleBarMenuBar.handleKeyArrowUp')
}

export const handleKeyEnd = async () => {
  await Rpc.invoke('TitleBarMenuBar.handleKeyEnd')
}

export const handleKeyHome = async () => {
  await Rpc.invoke('TitleBarMenuBar.handleKeyHome')
}
export const handleKeySpace = async () => {
  await Rpc.invoke('TitleBarMenuBar.handleKeySpace')
}

export const handleKeyEscape = async () => {
  await Rpc.invoke('TitleBarMenuBar.handleKeyEscape')
}

export const toggleIndex = async (index: number) => {
  await Rpc.invoke('TitleBarMenuBar.toggleIndex', index)
}

export const toggleMenu = async () => {
  await Rpc.invoke('TitleBarMenuBar.toggleMenu')
}
