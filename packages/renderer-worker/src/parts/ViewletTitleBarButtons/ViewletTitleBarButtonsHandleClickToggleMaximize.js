import * as Command from '../Command/Command.js'

export const handleClickToggleMaximize = async (state) => {
  // TODO need command for toggleMaximize
  await Command.execute('ElectronWindow.maximize')
  return state
}
