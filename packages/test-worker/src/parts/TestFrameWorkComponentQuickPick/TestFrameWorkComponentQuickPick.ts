import * as Rpc from '../Rpc/Rpc.ts'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.ts'

export const open = async () => {
  await Rpc.invoke('Viewlet.openWidget', ViewletModuleId.QuickPick, 'everything')
}

export const setValue = async (value: string) => {
  await Rpc.invoke('QuickPick.handleInput', value, 0)
}

export const focusNext = async () => {
  await Rpc.invoke('QuickPick.focusNext')
}

export const focusIndex = async (index: number) => {
  await Rpc.invoke('QuickPick.focusIndex', index)
}

export const focusPrevious = async () => {
  await Rpc.invoke('QuickPick.focusPrevious')
}

export const selectItem = async (label: string) => {
  await Rpc.invoke('QuickPick.selectItem', label)
}
