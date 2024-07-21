import * as Rpc from '../Rpc/Rpc.ts'

export const focus = async () => {
  await Rpc.invoke('ActivityBar.focus')
}

export const focusFirst = async () => {
  await Rpc.invoke('ActivityBar.focusFirst')
}

export const focusLast = async () => {
  await Rpc.invoke('ActivityBar.focusLast')
}

export const focusNext = async () => {
  await Rpc.invoke('ActivityBar.focusNext')
}

export const focusPrevious = async () => {
  await Rpc.invoke('ActivityBar.focusPrevious')
}

export const handleClick = async (index: number) => {
  await Rpc.invoke('ActivityBar.handleClick', index)
}

export const handleContextMenu = async () => {
  await Rpc.invoke('ActivityBar.handleContextMenu')
}

export const selectCurrent = async () => {
  await Rpc.invoke('ActivityBar.selectCurrent')
}
