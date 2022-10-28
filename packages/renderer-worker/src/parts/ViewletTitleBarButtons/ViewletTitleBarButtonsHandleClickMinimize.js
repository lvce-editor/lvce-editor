import * as Command from '../Command/Command.js'

export const handleClickMinimize = async (state) => {
  await Command.execute('ElectronWindow.minimize')
  return state
}
