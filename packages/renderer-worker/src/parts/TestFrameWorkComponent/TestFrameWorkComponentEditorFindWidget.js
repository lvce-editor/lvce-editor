import * as Command from '../Command/Command.js'

export const focusNext = async () => {
  await Command.execute('EditorFindWidget.focusNext')
}
