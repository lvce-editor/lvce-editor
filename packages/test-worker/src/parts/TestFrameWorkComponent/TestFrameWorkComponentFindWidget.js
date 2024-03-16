import * as Command from '../Command/Command.js'

export const focusNext = async () => {
  await Command.execute('FindWidget.focusNext')
}

export const setValue = async (value) => {
  await Command.execute('FindWidget.handleInput', value)
}
