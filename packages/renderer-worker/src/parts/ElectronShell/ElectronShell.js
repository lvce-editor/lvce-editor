import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const showItemInFolder = async (fullPath) => {
  await ElectronProcess.invoke('ElectronShell.showItemInFolder', fullPath)
}

export const beep = async () => {
  await ElectronProcess.invoke('ElectronShell.beep')
}

export const openExternal = async (url) => {
  await ElectronProcess.invoke('ElectronShell.openExternal', url)
}
