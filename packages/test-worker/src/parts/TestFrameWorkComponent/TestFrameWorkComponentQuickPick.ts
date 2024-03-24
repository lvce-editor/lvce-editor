import * as Rpc from '../Rpc/Rpc.ts'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const open = async () => {
  await Rpc.invoke('Viewlet.openWidget', ViewletModuleId.QuickPick, 'everything')
}

export const setValue = async (value) => {
  await Rpc.invoke('QuickPick.handleInput', value, 0)
}

export const focusNext = async () => {
  await Rpc.invoke('QuickPick.focusNext')
}

export const focusIndex = async (index) => {
  await Rpc.invoke('QuickPick.focusIndex', index)
}

export const focusPrevious = async () => {
  await Rpc.invoke('QuickPick.focusPrevious')
}

export const selectItem = async (label) => {
  await Rpc.invoke('QuickPick.selectItem', label)
}
