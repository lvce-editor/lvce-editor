import * as Command from '../Command/Command.js'

export const open = async () => {
  await Command.execute('Viewlet.openWidget', 'QuickPick', 'everything')
}

export const setValue = async (value) => {
  await Command.execute('QuickPick.handleInput', value, 0)
}

export const focusNext = async () => {
  await Command.execute('QuickPick.focusNext')
}

export const focusIndex = async (index) => {
  await Command.execute('QuickPick.focusIndex', index)
}

export const focusPrevious = async () => {
  await Command.execute('QuickPick.focusPrevious')
}

export const selectItem = async (label) => {
  await Command.execute('QuickPick.selectItem', label)
}
