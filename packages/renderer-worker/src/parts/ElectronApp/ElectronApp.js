import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const exit = async () => {
  return ElectronProcess.invoke('App.exit')
}
