import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const beep = async () => {
  await ElectronProcess.invoke('ElectronShell.beep')
}
