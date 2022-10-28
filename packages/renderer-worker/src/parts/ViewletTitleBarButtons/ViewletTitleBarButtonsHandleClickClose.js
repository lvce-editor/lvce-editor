import * as Command from '../Command/Command.js'

export const handleClickClose = async (state) => {
  await Command.execute('ElectronWindow.close')
  return state
}
