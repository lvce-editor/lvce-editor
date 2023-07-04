import * as ElectronWindow from '../ElectronWindow/ElectronWindow.js'

export const toggleDeveloperTools = () => {
  return ElectronWindow.toggleDevtools()
}
