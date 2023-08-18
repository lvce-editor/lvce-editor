import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const exit = async () => {
  await ElectronProcess.invoke('App.exit')
}
