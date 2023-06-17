import * as Command from '../Command/Command.js'
import * as NativeHostState from '../NativeHostState/NativeHostState.js'

export const handleClickToggleMaximize = async (state) => {
  if (NativeHostState.isMaximized()) {
    await Command.execute('ElectronWindow.unmaximize')
  } else {
    await Command.execute('ElectronWindow.maximize')
  }
  return state
}
