import * as ElectronWindow from '../ElectronWindow/ElectronWindow.js'
import * as SaveBuiltinState from '../SaveBuiltinState/SaveBuiltinState.js'

export const reloadElectron = async () => {
  await SaveBuiltinState.saveBuiltinState()
  return ElectronWindow.reload()
}
