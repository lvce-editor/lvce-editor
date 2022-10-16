import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const createBrowserViewQuickPick = (top, left, width, height) => {
  return ElectronProcess.invoke(
    'ElectronBrowserViewQuickPick.createBrowserViewQuickPick',
    top,
    left,
    width,
    height
  )
}

export const disposeBrowserViewQuickPick = () => {
  return ElectronProcess.invoke(
    'ElectronBrowserViewQuickPick.disposeBrowserViewQuickPick'
  )
}
