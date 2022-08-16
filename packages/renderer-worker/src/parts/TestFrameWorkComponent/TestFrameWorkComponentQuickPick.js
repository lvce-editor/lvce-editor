import * as Command from '../Command/Command.js'

export const open = async () => {
  await Command.execute('Viewlet.openWidget', 'QuickPick', 'everything')
}

export const setValue = async (value) => {
  await Command.execute('QuickPick.handleInput', value, 0)
}
