import * as Command from '../Command/Command.js'
import * as NativeHostState from '../NativeHostState/NativeHostState.js'

export const handleClickToggleMaximize = async (state) => {
  await (NativeHostState.isMaximized() ? Command.execute('ElectronWindow.unmaximize') : Command.execute('ElectronWindow.maximize'))
  return state
}
