import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const open = async () => {
  await ElectronProcess.invoke('ElectronWindowAbout.open')
}
