import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const crash = () => {
  return ElectronProcess.invoke('ProcessCrash.crash')
}

export const crashAsync = () => {
  return ElectronProcess.invoke('ProcessCrash.crashAsync')
}
